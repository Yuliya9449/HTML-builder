// const fs = require('fs');
const path = require('path');
const { mkdir: mkdirPromise } = require('fs/promises');
const { readdir: readdirPromise } = require('fs/promises');
const { copyFile: copyFilePromise } = require('fs/promises');
const { rm: rmPromise } = require('fs/promises');

const pathToFilesDir = path.resolve(__dirname, 'files');
const pathToCopyFilesDir = path.resolve(__dirname, 'files-copy');

async function copyDirectory(pathFromElem, pathToCopyElem) {
  try {
    await rmPromise(pathToCopyElem, { recursive: true, force: true });

    await mkdirPromise(pathToCopyElem);

    const elementsInDir = await readdirPromise(pathFromElem, {
      withFileTypes: true,
    });

    elementsInDir.forEach(async (elem) => {
      const pathToInnerElem = path.resolve(elem.path, elem.name);
      const pathToCopyInnerElem = path.resolve(pathToCopyElem, elem.name);

      if (elem.isDirectory()) {
        await copyDirectory(pathToInnerElem, pathToCopyInnerElem);
      }

      if (elem.isFile()) {
        await copyFilePromise(pathToInnerElem, pathToCopyInnerElem);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

copyDirectory(pathToFilesDir, pathToCopyFilesDir);
