var Guid = require('../guid.js');
var assert = require('assert');

suite('Test Guid generation', function() {

  test('raw', function(done) {
    var guid = Guid.raw();

    assert.equal(typeof(guid), 'string', 'Should return a string' );
    assert.equal(guid.length, 36, 'Should return a string with length 36' );
    done();
  });

  test('create', function(done) {
    var guid = Guid.create();

    assert.ok(Guid.isGuid(guid), 'Guid validation should succeed' );
    assert.equal(guid.value.length, 36, '.value should return a string with length 36' );
    assert.equal(guid.toString().length, 36, 'toString() should return a string with length 36' );
    done();
  });

  test('create from string', function(done) {
    var guidString = '6fdf6ffc-ed77-94fa-407e-a7b86ed9e59d';
    var guid = new Guid(guidString);

    assert.ok(Guid.isGuid(guid), 'Guid validation should succeed' );
    assert.equal(guid.value, guidString, '.value should match original' );
    assert.equal(guid.toString(), guidString, 'toString() should match original' );
    done();
  });

  test('compare to string', function(done) {
    var guidString = '6fdf6ffc-ed77-94fa-407e-a7b86ed9e59d';
    var guid = new Guid(guidString);

    assert.ok(guid.equals(guidString), 'Should match');
    done();
  });

   test('compare to Guid object', function(done) {
    var guidString = '6fdf6ffc-ed77-94fa-407e-a7b86ed9e59d';
    var guid1 = new Guid(guidString);
    var guid2 = new Guid(guidString);
    
    assert.ok(guid1.equals(guid2), 'Should match');
    done();
  });

});