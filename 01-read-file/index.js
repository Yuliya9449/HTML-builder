const fs = require('fs');
const path = require('path');
const process = require('process');

const currentPathToFile = path.join(__dirname, 'text.txt');

function readFile(pathToFile) {
  const readStream = fs.createReadStream(pathToFile, 'utf-8');

  readStream.on('data', (chunk) => process.stdout.write(chunk));

  readStream.on('error', (error) =>
    process.stdout.write(`${error.name}: ${error.message}`),
  );
}

readFile(currentPathToFile);

// node 01-read-file/
