const fs = require('fs');
const path = require('node:path');
const process = require('node:process');
const { stdin, stdout } = process;

stdout.write('\n Hello, write some text to save in text.txt: \n ');

let newWriteSteam = fs.createWriteStream(
  `${path.join(__dirname, 'text.txt')}`,
  'utf8',
);

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    closeProcess();
  }
  newWriteSteam.write(data);
});

stdin.resume();

process.on('SIGINT', () => {
  closeProcess();
});

function closeProcess() {
  stdin.write('\n EXIT! See you soon... \n ');
  newWriteSteam.close();
  process.exit();
}
