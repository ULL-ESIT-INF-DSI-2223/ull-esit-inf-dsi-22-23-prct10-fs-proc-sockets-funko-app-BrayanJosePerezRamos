import net from 'net';
import {spawn} from 'child_process';
import chalk from 'chalk';

// servidor que debe recibir la petición del cliente, procesarla, esto es, ejecutar el comando solicitado, y devolver la respuesta del comando al cliente. Para ello, piense que el comando solicitado puede haberse ejecutado correctamente o puede haber fallado, por ejemplo, por no existir o porque se le han pasado unos argumentos no válidos.
const server = net.createServer((connection) => {
  console.log('A client has connected.');
  connection.on('data', (data) => {
    const message = JSON.parse(data.toString());
    console.log('Data received from client: ' + data);
    const command = message.command;
    const options = message.options;
    try {
      const child = spawn(command, options);
      child.stdout.on('data', (data) => {
        //console.log(`stdout: ${data}`);
        connection.write(data);
      });
      child.on('close', (code) => {
        connection.write(`child process exited with code ${code}\n`);
        connection.end();
      });
      child.on('error', (err) => {
        //console.log(`child process error: ${err.message}`);
        connection.write(chalk.red(`Error: ${err.message}\n`));
        connection.end();
      });
    } catch (error: any) {
      connection.write(chalk.red(`Error: ${error.message}\n`));
      connection.end();
    }
  });
  connection.on('close', () => {
    console.log('A client has disconnected.');
    console.log('Waiting for a new connection...');
  });
});
server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
    