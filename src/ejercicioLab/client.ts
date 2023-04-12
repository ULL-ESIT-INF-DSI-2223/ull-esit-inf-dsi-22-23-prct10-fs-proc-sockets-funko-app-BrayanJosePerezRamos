import net from 'net';

// manejar los argumentos de la línea de comandos
const args = process.argv.slice(2);
const command = args[0];
const options = args.slice(1);

const client = net.connect({port: 8080}, () => {
  console.log('Connected to server!');
  const message = {
    command: command,
    options: options,
  };
  client.write(JSON.stringify(message));
  let wholeData = '';
  client.on('data', (data) => {
    wholeData += data;
  });
  client.on('end', () => {
    console.log(wholeData);
    console.log('Disconnected from server');
  });
});