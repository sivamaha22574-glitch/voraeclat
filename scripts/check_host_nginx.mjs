import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec('grep -rn "voraeclat" /etc/nginx/', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('Host nginx configs:\n' + out);
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
