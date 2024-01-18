const promises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const currentPathStyle = path.resolve(__dirname, 'styles');
const copyPathStyle = path.resolve(__dirname, 'project-dist', 'style.css');

const currentPathHtml = path.resolve(__dirname, 'template.html');
const copyPathHtml = path.resolve(__dirname, 'project-dist', 'index.html');

const currentPathAssets = path.resolve(__dirname, 'assets');
const copyPathAssets = path.join(__dirname, 'project-dist', 'assets');

const componentsPath = path.resolve(__dirname, 'components');

async function makeBundler(currentPath, copyPath) {
  const fileNames = await promises.readdir(currentPath, {
    withFileTypes: true,
  });
  const newWriteSteam = fs.createWriteStream(copyPath, 'utf-8');
  for (const file of fileNames) {
    if (
      path.extname(path.join(currentPath, file.name)) === '.css' &&
      file.isFile()
    ) {
      const fileContent = await promises.readFile(
        path.join(currentPath, file.name),
        'utf-8',
      );
      newWriteSteam.write(`${fileContent}\n`);
    }
  }
  newWriteSteam.end();
}

async function isExist(path) {
  try {
    await promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

async function copyFolder(currentPath, copyPath) {
  if (await isExist(copyPath)) {
    await promises.rm(copyPath, { recursive: true, force: true });
    await promises.mkdir(copyPath);
  } else {
    await promises.mkdir(copyPath, { recursive: true });
  }
  const fileNames = await promises.readdir(currentPath, {
    withFileTypes: true,
  });
  fileNames.forEach(async (file) => {
    if (file.isFile()) {
      const currentFilePath = path.join(currentPath, file.name);
      const copyFilePath = path.join(copyPath, file.name);
      await promises.copyFile(currentFilePath, copyFilePath);
    } else if (file.isDirectory()) {
      const nestedCurrentPath = path.join(currentPath, file.name);
      const nestedCopyPath = path.join(copyPath, file.name);
      await copyFolder(nestedCurrentPath, nestedCopyPath);
    }
  });
}

async function readTemplate() {
  const template = await promises.readFile(currentPathHtml, 'utf-8');
  return template;
}

async function findComponents(template) {
  const regular = /{{ *(\w+) *}}/g;
  const matches = Array.from(template.matchAll(regular));
  if (matches.length === 0) return;
  return matches;
}

async function replaceComponents(template, components) {
  for (const [component, tag] of components) {
    const componentPath = path.join(componentsPath, `${tag}.html`);
    const componentContent = await promises.readFile(componentPath, 'utf-8');
    template = template.replace(component, componentContent);
  }
  return template;
}

async function saveIndex(template) {
  const newWriteSteam = fs.createWriteStream(copyPathHtml, 'utf-8');
  newWriteSteam.write(template);
}

async function builder() {
  try {
    await copyFolder(currentPathAssets, copyPathAssets);
    await makeBundler(currentPathStyle, copyPathStyle);
    const template = await readTemplate();
    const components = await findComponents(template);
    const newTemplate = await replaceComponents(template, components);
    await saveIndex(newTemplate);
  } catch (error) {
    console.error(error.message);
  }
}

builder();
