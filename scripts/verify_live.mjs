import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
    echo "=== HTML BUNDLE CHECK ==="
    curl -s http://127.0.0.1:5001/ | grep -o 'index-[^"]*\\.js'

    echo "=== USER FIND BY EMAIL ==="
    curl -s "http://127.0.0.1:5001/api/users/find?q=vedakholigamers@gmail.com"
    echo ""

    echo "=== USER FIND BY MOBILE ==="
    curl -s "http://127.0.0.1:5001/api/users/find?q=9443217591"
    echo ""

    echo "=== ORDERS BY EMAIL ==="
    curl -s "http://127.0.0.1:5001/api/orders/customer/vedakholigamers@gmail.com"
    echo ""

    echo "=== ORDERS BY MOBILE ==="
    curl -s "http://127.0.0.1:5001/api/orders/customer/9443217591"
    echo ""
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
