const fs = require('fs').promises;
const path = require('path');

const currentPath = path.resolve(__dirname, 'files');
const copyPath = path.resolve(__dirname, 'files-copy');

async function isExist(path) {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

async function makeFolder(currentPath, copyPath) {
  if (await isExist(copyPath)) {
    await fs.rm(copyPath, { recursive: true, force: true });
    await fs.mkdir(copyPath);
  } else {
    await fs.mkdir(copyPath, { recursive: true });
  }
  const fileNames = await fs.readdir(currentPath, { withFileTypes: true });
  fileNames.forEach((file) => {
    if (file.isFile()) {
      const currentFilePath = path.join(currentPath, file.name);
      const copyFilePath = path.join(copyPath, file.name);
      return fs.copyFile(currentFilePath, copyFilePath);
    }
    // const filePaths = fileNames.map((fileName) =>
    //   path.join(currentPath, fileName),
    // );
  });
}

makeFolder(currentPath, copyPath);
// makeFolder(currentPath, copyPath).then((data) => {
//   data.forEach((item) => {
//     if (item.isFile()) {
//       let pathItem = path.join(currentPath, item.name);
//       let pathItemDes = path.join(copyPath, item.name);
//       fs.copyFile(pathItem, pathItemDes);
//     }
//   });
// });
