#!/bin/bash
# ===================================================================
# Voraeclat - Automated MongoDB & Storage Backup Script
# Usage: bash ~/kids/scripts/backup.sh
# ===================================================================
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_ROOT="/home/saravanan/backups"
BACKUP_DIR="$BACKUP_ROOT/backup_$TIMESTAMP"
LATEST_DIR="$BACKUP_ROOT/latest"
ARCHIVE_FILE="/home/saravanan/voraeclat_backup_$TIMESTAMP.tar.gz"

echo "=== 1. Creating backup directories ==="
mkdir -p "$BACKUP_DIR/mongodb_bson"
mkdir -p "$BACKUP_DIR/mongodb_json"
mkdir -p "$BACKUP_DIR/storage_uploads"

echo "=== 2. Exporting MongoDB Atlas BSON (mongodump) ==="
docker run --rm --user $(id -u):$(id -g) -v "$BACKUP_DIR/mongodb_bson":/dump mongo:7 mongodump --uri="mongodb+srv://mayil:mayil12345@cluster0.yz0ig7h.mongodb.net/voraeclat" --out=/dump

echo "=== 3. Exporting MongoDB Atlas Human-Readable JSON ==="
docker exec voraeclat-backend node -e "
  import('mongoose').then(async (m) => {
    const mongoose = m.default;
    const fs = await import('fs');
    await mongoose.connect(process.env.MONGODB_URI);
    const collections = ['products', 'banners', 'orders', 'users', 'coupons', 'adcampaigns', 'franchiseleads', 'otps', 'contactmessages'];
    for (const col of collections) {
      const docs = await mongoose.connection.db.collection(col).find({}).toArray();
      fs.writeFileSync('/tmp/' + col + '.json', JSON.stringify(docs, null, 2));
      console.log('Exported ' + col + ': ' + docs.length + ' documents');
    }
    process.exit(0);
  });
"

# Copy JSON files from backend container to backup directory
for col in products banners orders users coupons adcampaigns franchiseleads otps contactmessages; do
  docker cp voraeclat-backend:/tmp/$col.json "$BACKUP_DIR/mongodb_json/$col.json"
  docker exec voraeclat-backend rm -f /tmp/$col.json
done

echo "=== 4. Backing up uploads & public storage ==="
if [ -d "/home/saravanan/kids/backend/public/uploads" ]; then
  cp -r /home/saravanan/kids/backend/public/uploads/* "$BACKUP_DIR/storage_uploads/" 2>/dev/null || true
fi
cp -r /home/saravanan/kids/backend/public/hero-* "$BACKUP_DIR/storage_uploads/" 2>/dev/null || true

echo "=== 5. Writing README restoration guide ==="
cat << 'EOF' > "$BACKUP_DIR/README.txt"
===================================================================
VORAECLAT FULL BACKUP ARCHIVE
Database: MongoDB Atlas (Cluster0 / voraeclat)
Storage: /uploads & /hero assets
===================================================================

DIRECTORY STRUCTURE:
- mongodb_bson/     : Official MongoDB binary dump for mongorestore
- mongodb_json/     : Clean formatted JSON files for inspection/import
- storage_uploads/  : All uploaded photos, banners, and product media

HOW TO RESTORE MONGODB FROM BSON:
docker run --rm -v $(pwd)/mongodb_bson/voraeclat:/dump mongo:7 mongorestore --uri="YOUR_MONGODB_URI/voraeclat" --drop /dump

HOW TO RESTORE UPLOADS:
cp -r storage_uploads/* /home/saravanan/kids/backend/public/uploads/
===================================================================
EOF

echo "=== 6. Updating 'latest' pointer ==="
rm -rf "$LATEST_DIR"
cp -r "$BACKUP_DIR" "$LATEST_DIR"

echo "=== 7. Creating compressed archive in /home/saravanan ==="
cd /home/saravanan
tar -czf "$ARCHIVE_FILE" -C "$BACKUP_ROOT" "backup_$TIMESTAMP"
ln -sf "$ARCHIVE_FILE" /home/saravanan/voraeclat_backup_latest.tar.gz

echo "=== BACKUP COMPLETED: $ARCHIVE_FILE ==="
ls -lh "$ARCHIVE_FILE"
