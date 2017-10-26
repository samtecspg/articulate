'use strict';

const Fs = require('fs');
const Path = require('path');


const internals = {};


module.exports = function (appname, startDir) {
  const filename = `.${appname}rc.js`;
  const dirPaths = internals.dirPaths(startDir || process.cwd(), filename);
  const homePaths = internals.homePaths(filename);

  // Didn't find in the parent folders, try at home next
  return internals.checkPaths(dirPaths) || internals.checkPaths(homePaths);
};


internals.checkPaths = function (paths, index) {
  index = index || 0;
  if (internals.isFile(paths[index])) {
    return paths[index];
  }

  if (++index === paths.length) {
    return;
  }

  return internals.checkPaths(paths, index);
};


internals.isFile = function (filePath) {
  try {
    const stat = Fs.statSync(filePath);
    return stat.isFile();
  } catch (err) {
    return false;
  }
};


internals.dirPaths = function (directory, filename) {
  const filePaths = [];
  const pathRoot = Path.parse(directory).root;

  do {
    filePaths.push(Path.join(directory, filename));
    directory = Path.dirname(directory);
  } while (directory !== pathRoot);

  return filePaths;
};


internals.homePaths = function (filename) {
  const home = process.env.USERPROFILE || process.env.HOME;
  return [
    Path.join(home, filename),
    Path.join(home, '.config', filename)
  ];
};
