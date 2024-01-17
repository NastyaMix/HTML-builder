const fs = require('fs');
const path = require('node:path');

let newReadSteam = fs.createReadStream(
  `${path.join(__dirname, 'text.txt')}`,
  'utf8',
);

newReadSteam.on('data', (data) => {
  console.log(data.toString());
});

newReadSteam.on('end', () => {
  newReadSteam.close();
});
