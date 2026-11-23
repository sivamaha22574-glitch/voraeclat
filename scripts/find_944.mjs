import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const mongoCmd = `mongosh voraeclat --eval 'printjson(db.users.find({ mobile: /9443217591/ }).toArray());'`;
  conn.exec(`docker exec voraeclat-mongodb ${mongoCmd}`, (err, stream) => {
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
