const fs = require('fs');
const path = require('path');
const { mkdir: mkdirPromise } = require('fs/promises');
const { readdir: readdirPromise } = require('fs/promises');
const { readFile: readFilePromise } = require('fs/promises');
const { copyFile: copyFilePromise } = require('fs/promises');
const { rm: rmPromise } = require('fs/promises');

const pathToProjectDistDir = path.resolve(__dirname, 'project-dist');

const pathToTemplateHtml = path.resolve(__dirname, 'template.html');
const pathToIndexHtml = path.resolve(pathToProjectDistDir, 'index.html');

const pathToHTMLComponentsDir = path.resolve(__dirname, 'components');

const pathToStylesDir = path.resolve(__dirname, 'styles');
const pathToBundleCSS = path.resolve(pathToProjectDistDir, 'style.css');

const pathToAssetsDir = path.resolve(__dirname, 'assets');
const pathToCopyAssetsDir = path.resolve(pathToProjectDistDir, 'assets');

async function createNewDir(pathToDir) {
  try {
    await rmPromise(pathToDir, { recursive: true, force: true });
    await mkdirPromise(pathToDir, { recursive: true });
  } catch (error) {
    console.log(error);
  }
}

async function getHTMLComponents(pathToDir) {
  try {
    const componentsObj = (
      await readdirPromise(pathToDir, { withFileTypes: true })
    ).reduce((acc, file) => {
      const pathToFile = path.resolve(file.path, file.name);

      const fileName = path.parse(pathToFile).name;
      const fileExt = path.parse(pathToFile).ext;

      const componentName = `{{${fileName}}}`;

      if (fileExt === '.html') {
        acc[componentName] = pathToFile;
      }
      return acc;
    }, {});

    return componentsObj;
  } catch (error) {
    console.log(error);
  }
}

async function getFullHTML(pathToInputFile, pathToOutputFile, componentsObj) {
  try {
    const readStream = fs.createReadStream(pathToInputFile, {
      encoding: 'utf-8',
    });
    const writeStream = fs.createWriteStream(pathToOutputFile);
    readStream.on('data', async (chunk) => {
      for (const [template, pathToHTMLComponent] of Object.entries(
        componentsObj,
      )) {
        chunk = chunk.replace(
          template,
          await readFilePromise(pathToHTMLComponent),
        );
      }

      writeStream.write(`${chunk}\n`);
    });
  } catch (error) {
    console.log(error);
  }
}

async function mergeStyles(pathToStylesDir, pathToBundleCSS) {
  try {
    const writeStream = fs.createWriteStream(pathToBundleCSS);

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
  } catch (error) {
    console.log(error);
  }
}

async function copyAssets(pathFromElem, pathToCopyElem) {
  try {
    await mkdirPromise(pathToCopyElem);

    const elementsInDir = await readdirPromise(pathFromElem, {
      withFileTypes: true,
    });

    elementsInDir.forEach(async (elem) => {
      const pathToInnerElem = path.resolve(elem.path, elem.name);
      const pathToCopyInnerElem = path.resolve(pathToCopyElem, elem.name);

      if (elem.isDirectory()) {
        await copyAssets(pathToInnerElem, pathToCopyInnerElem);
      }

      if (elem.isFile()) {
        await copyFilePromise(pathToInnerElem, pathToCopyInnerElem);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function buildHTML() {
  try {
    await createNewDir(pathToProjectDistDir);
    const htmlComponentsObj = await getHTMLComponents(pathToHTMLComponentsDir);

    await getFullHTML(pathToTemplateHtml, pathToIndexHtml, htmlComponentsObj);

    await mergeStyles(pathToStylesDir, pathToBundleCSS);

    await copyAssets(pathToAssetsDir, pathToCopyAssetsDir);
  } catch (error) {
    console.log(error);
  }
}

buildHTML();

// node 06-build-page
