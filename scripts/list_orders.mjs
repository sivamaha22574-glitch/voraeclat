import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const mongoCmd = `mongosh voraeclat --quiet --eval "print(JSON.stringify(db.orders.find({}, { orderId: 1, customerMobile: 1, totalAmount: 1, status: 1, 'deliveryAddress.name': 1, 'items.name': 1, createdAt: 1 }).toArray(), null, 2));"`;
  conn.exec(`docker exec voraeclat-mongodb ${mongoCmd}`, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({
  host: '103.181.21.153',
  port: 22,
  username: 'saravanan',
  password: '86404519',
  readyTimeout: 60000
});
