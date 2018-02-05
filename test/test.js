const path = require('path');
const fse = require('fs-extra');
const pathJoin = path.join;

try {
  const srcDir = pathJoin(__dirname, '../site');
  const targetDir = pathJoin(process.cwd(), 'site2');
  console.log(targetDir);
  fse.copySync(srcDir, targetDir);
  console.log('success!');
  return true;
} catch (err) {
  console.log(err.message);
  return false;
}
