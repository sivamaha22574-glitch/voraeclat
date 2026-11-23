import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const mongoCmd = `mongosh voraeclat --eval '
    // 1. Delete the old dummy 9876543210 records
    db.users.deleteMany({
      $or: [
        { mobile: "9876543210" },
        { mobile: "+91 9876543210" },
        { email: "vedakholigamers@gmail.com" }
      ]
    });

    // 2. Delete any duplicate 9443217591 records
    db.users.deleteMany({
      mobile: { $in: ["9443217591", "+91 9443217591"] }
    });

    // 3. Insert one single canonical user record for Saravanan with real mobile and email
    db.users.insertOne({
      name: "Saravanan",
      email: "vedakholigamers@gmail.com",
      mobile: "9443217591",
      role: "customer",
      isClubMember: false,
      clubTier: "Standard",
      addresses: [
        {
          title: "Home",
          name: "Saravanan",
          phone: "9443217591",
          address: "gandhiji street",
          city: "erode",
          state: "Tamil Nadu",
          pincode: "638005",
          isDefault: true
        }
      ],
      children: [],
      walletBalance: 0,
      notifyOffers: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 4. Update order VOR-455555 and VOR-960578
    db.orders.updateMany(
      {
        $or: [
          { orderId: "VOR-455555" },
          { customerMobile: "9443217591" },
          { "deliveryAddress.phone": "9443217591" }
        ]
      },
      {
        $set: {
          customerEmail: "vedakholigamers@gmail.com",
          customerName: "Saravanan",
          customerMobile: "9443217591"
        }
      }
    );

    print("Canonical user record for Saravanan:");
    printjson(db.users.find({ email: "vedakholigamers@gmail.com" }).toArray());
  '`;

  conn.exec(`docker exec voraeclat-mongodb ${mongoCmd}`, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', (code) => {
      console.log('\nScript exit code:', code);
      conn.end();
      process.exit(code || 0);
    });
  });
}).connect({
  host: '103.181.21.153',
  port: 22,
  username: 'saravanan',
  password: '86404519',
  readyTimeout: 60000
});
