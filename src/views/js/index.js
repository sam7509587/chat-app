import { fs } from 'fs';

const testFolder = '/js/';

fs.readdir(testFolder, (err, files) => {
  files.forEach((file) => {
    console.log(file);
  });
});
