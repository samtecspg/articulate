var test = require('tape')
var ordinal = require('../')
var fixtures = require('./fixtures.json')

test('returns ordinal numbers', function (t) {
  fixtures.forEach(function (x) {
    t.equal(ordinal(x.i), x.ordinal, x.i + ' === ' + x.ordinal)
  })

  t.end()
})

test('throws on non-numbers', function (t) {
  t.throws(function () {
    ordinal('foo')
  }, /Expected Number, got string foo/)
  t.end()
})
