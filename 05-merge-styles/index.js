const fs = require('fs');
const promises = require('fs').promises;
const path = require('path');

const currentPath = path.resolve(__dirname, 'styles');
const copyPath = path.resolve(__dirname, 'project-dist', 'bundle.css');

async function makeBundler() {
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

makeBundler();
