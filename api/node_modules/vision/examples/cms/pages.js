'use strict';
// Load modules

const Fs = require('fs');
const Path = require('path');


// Declare internals

const internals = {};


internals.Pages = function (dirPath) {

    this._dirPath = dirPath;
    this._cache = {};
    this.loadPagesIntoCache();
};


internals.Pages.prototype.loadPagesIntoCache = function () {

    const self = this;
    Fs.readdirSync(this._dirPath).forEach((file) => {

        if (file[0] !== '.') {
            self._cache[file] = self.loadPageFile(file);
        }
    });
};


internals.Pages.prototype.getAll = function () {

    return this._cache;
};


internals.Pages.prototype.getPage = function (name) {

    return this._cache[name];
};


internals.Pages.prototype.savePage = function (name, contents) {

    name = Path.normalize(name);
    Fs.writeFileSync(Path.join(this._dirPath, name), contents);
    this._cache[name] = { name, contents };
};


internals.Pages.prototype.loadPageFile = function (file) {

    const contents = Fs.readFileSync(Path.join(this._dirPath, file));

    return {
        name: file,
        contents: contents.toString()
    };
};

exports = module.exports = new internals.Pages(Path.join(__dirname, '_pages'));
