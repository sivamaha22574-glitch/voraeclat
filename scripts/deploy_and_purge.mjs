import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cd /home/saravanan/kids && git pull && docker compose up -d --build backend frontend && docker exec voraeclat-mongodb mongosh voraeclat --eval 'db.orders.deleteMany({ orderId: { $in: ["ORD-910482", "ORD-739105", "VOR-215408", "VOR-601823", "VOR-636558", "VOR-999888", "VOR-575977"] } }); print("Remaining orders in MongoDB:"); printjson(db.orders.find({}, { orderId: 1, customerName: 1, totalAmount: 1, status: 1 }).toArray());'`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', (code) => {
      console.log('\nDeploy & clean complete, exit code:', code);
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
