'use strict';

const Code = require('code');
const Lab = require('lab');
const FindRc = require('../');


const lab = exports.lab = Lab.script();
const it = lab.it;
const expect = Code.expect;


it('finds an rc in the current working directory', (done) => {
  const filePath = FindRc('find');
  expect(filePath).to.exist();
  expect(filePath).to.contain('.findrc.js');
  done();
});


it('finds a file in a parent directory', (done) => {
  const filePath = FindRc('find', __dirname);
  expect(filePath).to.exist();
  expect(filePath).to.contain('.findrc.js');
  done();
});


it('returns undefined when a file isn\'t found', (done) => {
  const filePath = FindRc('no_way_will_this_exist');
  expect(filePath).to.not.exist();
  done();
});

it('returns undefined when a file isn\'t found and env.USERPROFILE is set', (done) => {
  process.env.USERPROFILE = process.env.HOME;
  delete process.env.HOME;
  const filePath = FindRc('no_way_will_this_exist');
  expect(filePath).to.not.exist();
  done();
});
