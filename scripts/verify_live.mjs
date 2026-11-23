import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
    echo "=== HTML BUNDLE CHECK ==="
    curl -s http://127.0.0.1:5001/ | grep -o 'index-[^"]*\\.js'

    echo "=== PRODUCT MODAL GIFT BOX TEXT CHECK ==="
    curl -s http://127.0.0.1:5001/assets/ProductModal-ClBzv8xe.js | grep -o 'Add a [^"]*Gift Box' || echo "Check done"

    echo "=== CHECK FOR ANY HAY IN FRONTEND ASSETS ==="
    grep -i "Add a HAY" /home/saravanan/kids/backend/public/assets/*.js || echo "No HAY gift box found!"
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', (code) => {
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
