import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const mongoCmd = `mongosh voraeclat --eval '
    // 1. Remove all dummy / seed / test orders
    const deletedOrders = db.orders.deleteMany({
      $or: [
        { orderId: { $in: ["ORD-910482", "ORD-739105", "VOR-215408", "VOR-601823", "VOR-636558", "VOR-999888", "VOR-575977"] } },
        { orderId: /^ORD-2852/ },
        { orderId: /^PS-/ },
        { "deliveryAddress.name": /^test/i },
        { customerName: /^test/i }
      ]
    });
    print("Deleted orders:", deletedOrders.deletedCount);

    // 2. Remove dummy / seed users
    const deletedUsers = db.users.deleteMany({
      $or: [
        { name: /^test/i },
        { email: "test@example.com" },
        { email: "customer@example.com" },
        { name: { $in: ["Pooja Sharma", "Ananya Deshmukh", "Rahul Verma"] } }
      ]
    });
    print("Deleted users:", deletedUsers.deletedCount);

    // 3. Print remaining clean orders
    print("Remaining orders:");
    printjson(db.orders.find({}, { orderId: 1, customerName: 1, totalAmount: 1, status: 1 }).toArray());

    // 4. Print remaining clean users
    print("Remaining users:");
    printjson(db.users.find({}, { name: 1, email: 1, mobile: 1, role: 1 }).toArray());
  '`;

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
