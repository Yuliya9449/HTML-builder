// const fs = require('fs');
const path = require('path');
const { mkdir: mkdirPromise } = require('fs/promises');
const { readdir: readdirPromise } = require('fs/promises');
const { copyFile: copyFilePromise } = require('fs/promises');
const { unlink: unlinkPromise } = require('fs/promises');

const pathToFilesDir = path.resolve(__dirname, 'files');
const pathToCopyFilesDir = path.resolve(__dirname, 'files-copy');

async function copyDir() {
  try {
    // Создание папки files-copy, флаг { recursive: true } означает,
    // что если папка существует, то её не нужно создавать
    await mkdirPromise(pathToCopyFilesDir, { recursive: true });

    // Чтение содержимого папки files-copy
    const filesToRemove = await readdirPromise(pathToCopyFilesDir, {
      withFileTypes: true,
    });

    // Очистка папки files-copy
    filesToRemove.forEach(async (file) => {
      const pathToFile = path.resolve(file.path, file.name);
      await unlinkPromise(pathToFile);
    });

    // Чтение содержимого папки files
    const fileNamesArr = await readdirPromise(pathToFilesDir);

    // Копирование файлов
    fileNamesArr.forEach(async (fileName) => {
      const pathToFile = path.resolve(pathToFilesDir, fileName);
      const pathToCopyFile = path.resolve(pathToCopyFilesDir, fileName);

      await copyFilePromise(pathToFile, pathToCopyFile);
    });
  } catch (error) {
    console.log(error);
  }
}

copyDir();

// node 04-copy-directory/
