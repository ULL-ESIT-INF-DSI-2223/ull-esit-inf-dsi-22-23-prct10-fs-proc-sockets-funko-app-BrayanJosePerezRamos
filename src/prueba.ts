import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function main() {
  // Parse the command line arguments
  const argv = await yargs(hideBin(process.argv))
  .command('stats', 'Mostrar estadísticas del archivo', {
      file: {
      description: 'Ruta del archivo',
      demand: true,
      alias: 'f',
      type: 'string',
      },
      lines: {
      description: 'Mostrar número de líneas',
      alias: 'l',
      type: 'boolean',
      },
      words: {
      description: 'Mostrar número de palabras',
      alias: 'w',
      type: 'boolean',
      },
      chars: {
      description: 'Mostrar número de caracteres',
      alias: 'c',
      type: 'boolean',
      },
  })
  .check((argv) => {
      if (argv.lines || argv.words || argv.chars) {
      return true;
      } else {
      throw new Error('Debes proporcionar al menos una opción');
      }
  })
  .demandCommand(1, 'Debes proporcionar un comando')
  .help()
  .alias('help', 'h')
  .argv;

  // Leemos el archivo y mostramos las estadísticas según los argumentos proporcionados
  const file = argv.file;
  fs.readFile(file as string, 'utf8', (err, data) => {
  if (err) {
      console.error('Error al leer el archivo:', err.message);
      process.exit(1);
  }

  const lines = data.split('\n').length;
  const words = data.split(/\s+/).length;
  const chars = data.length;

  if (argv.lines) console.log('Número de líneas:', lines);
  if (argv.words) console.log('Número de palabras:', words);
  if (argv.chars) console.log('Número de caracteres:', chars);
  });
}

main();