const fs = require('fs');
const path = require('path');
const { readdir: readdirPromise } = require('fs/promises');

const pathToStylesDir = path.resolve(__dirname, 'styles');
const pathToProjectDist = path.resolve(__dirname, 'project-dist');
const pathToBundleCssFile = path.resolve(pathToProjectDist, 'bundle.css');

const writeStream = fs.createWriteStream(pathToBundleCssFile);

async function mergeStyles() {
  try {
    const filesInStyleDir = await readdirPromise(pathToStylesDir, {
      withFileTypes: true,
    });

    const filesToMergePaths = filesInStyleDir
      .map((file) => {
        const pathToFile = path.resolve(file.path, file.name);
        return pathToFile;
      })
      .filter((elem) => {
        const fileExtension = path.parse(elem).ext;
        return fileExtension.toLowerCase() === '.css';
      });

    // копирование файлов
    filesToMergePaths.forEach((filePath) => {
      const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
      readStream.on('data', (chunk) => {
        writeStream.write(`${chunk}\n`);
      });
    });

    // console.log('files', filesToMergePaths, 'merged successful');
  } catch (error) {
    console.log(error);
  }
}

mergeStyles();

// node 05-merge-styles
