const fs = require('fs');
const path = require('node:path');
const { stdout } = require('process');
const myPath = path.join(__dirname, 'secret-folder');

fs.readdir(myPath, { withFileTypes: true }, function (err, files) {
  files.forEach((file) => {
    if (err) {
      stdout.write(err.message);
    }
    if (file.isFile()) {
      const filePath = path.resolve(myPath, file.name);
      const fileName = path.parse(filePath).name;
      const fileExt = path.parse(filePath).ext.slice(1);
      getSize(filePath, (err, fileSize) => {
        stdout.write(`${fileName} - ${fileExt} - ${fileSize / 1024} kB\n`);
      });
    }
  });
});

function getSize(filePath, callback) {
  fs.stat(filePath, function (err, stats) {
    if (err) {
      stdout.write(err.message);
    }
    callback(null, stats.size);
  });
}
