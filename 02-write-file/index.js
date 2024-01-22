const path = require('path');
const readline = require('readline');
const fs = require('fs');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathToFile);
const readlineInterface = readline.createInterface(stdin, pathToFile);

stdout.write('\nPlease, enter some text\n\n');

readlineInterface.on('line', readlineHandler);

async function readlineHandler(answer) {
  try {
    if (answer.trim() === 'exit') {
      sayGoodBye();
    } else {
      writeStream.write(`${answer}\n`);
    }
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
}

process.on('SIGINT', sayGoodBye);

function sayGoodBye() {
  stdout.write('\nGood bye!!!\n');
  writeStream.end();
  process.exit();
}

// node 02-write-file/
