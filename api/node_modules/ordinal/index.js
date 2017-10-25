var indicator = require('./indicator')

function ordinal (i) {
  if (typeof i !== 'number') throw new TypeError('Expected Number, got ' + (typeof i) + ' ' + i)
  return i + indicator(i)
}

ordinal.indicator = indicator
module.exports = ordinal
