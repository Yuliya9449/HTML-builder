const path = require('path');
const { readdir: readdirPromise } = require('fs/promises');
const { stat: statPromise } = require('fs/promises');

const pathToDir = path.join(__dirname, 'secret-folder');

//!======================

async function outputFilesInfo() {
  try {
    const elementsInDir = await readdirPromise(pathToDir, {
      withFileTypes: true,
    });

    const filesInfoPromisesArr = elementsInDir
      .filter((elem) => elem.isFile())
      .map(async (file) => {
        const filePath = path.resolve(file.path, file.name);
        const { ext: fileExt, name: fileName } = path.parse(filePath);
        const fileStat = (await statPromise(filePath)).size;
        return { fileName, fileExt, fileStat };
      });

    // можно заменить map на forEach, и без Promise.all, но тогда инфо о файлах не в том порядке
    const filesInfoArr = await Promise.all(filesInfoPromisesArr);
    // console.log(filesInfoArr);

    console.log(
      filesInfoArr
        .map(
          (fileInfo) =>
            `${fileInfo.fileName} - ${fileInfo.fileExt.replace('.', '')} - ${
              fileInfo.fileStat
            }b`,
        )
        .join('\n'),
    );
  } catch (error) {
    console.log(error);
  }
}

outputFilesInfo();

//!=====================

// node 03-files-in-folder
