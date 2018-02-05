const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const fse = require('fs-extra');

const writeFile = fs.writeFileSync;
const pathJoin = path.join;
const projectDir = pathJoin(__dirname, '../../../');

function reportNoConfig() {
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
  console.log(chalk.bgRed('!! Unable to bisheng: project\'s package.json either missing !!'));
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
}

function reportCompletion() {
  console.log(chalk.bgGreen('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
  console.log(chalk.bgGreen('!! bisheng && bisheng-theme-yd was successfully installed for the project !!'));
  console.log(chalk.bgGreen('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
}

function reportError(msg) {
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
  console.log(chalk.bgRed(`!! ${msg} !!`));
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
}

function addConfigHooks(cfg) {
  if (!cfg.scripts) {
    cfg.scripts = {};
  }

  cfg.scripts = Object.assign(cfg.scripts, {
    // dist: 'yd-tools run dist',
    start: 'rimraf _site && node ./site/scripts/generateColorLess.js && cross-env NODE_ENV=development bisheng start -c ./site/bisheng.config.js',
    site: 'rimraf _site && cross-env NODE_ENV=production bisheng build -c ./site/bisheng.config.js && node ./site/scripts/generateColorLess.js',
  });

  try {
    writeFile(pathJoin(projectDir, 'package.json'), JSON.stringify(cfg, null, 2));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function copyFile() {
  try {
    const srcDir = pathJoin(__dirname, '../site');
    console.log(srcDir);
    const targetDir = pathJoin(projectDir, 'site');
    console.log(targetDir);
    if (fs.existsSync(targetDir)) {
      console.log('site 目录已存在，不再创建新的主题模板');
    } else {
      fse.copySync(srcDir, targetDir);
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function init() {
  const cfg = require(path.join(projectDir, 'package.json'));

  if (!cfg) {
    reportNoConfig();
    process.exit(1);
  } else {
    if (copyFile()) {
      if (addConfigHooks(cfg)) {
        reportCompletion();
      } else {
        reportError('add config hooks is error');
        process.exit(1);
      }
    } else {
      reportError('copy file is error');
      process.exit(1);
    }
  }
}

init();
