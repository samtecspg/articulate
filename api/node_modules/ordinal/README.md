# ordinal

[![build status](https://secure.travis-ci.org/dcousens/ordinal.png)](http://travis-ci.org/dcousens/ordinal)
[![Version](http://img.shields.io/npm/v/ordinal.svg)](https://www.npmjs.org/package/ordinal)

Module to provide the ordinal letters following a numeral.


## Examples
Numbers only, anything else will throw a `TypeError`.

``` javascript
var ordinal = require('ordinal')

ordinal(1) // '1st'
ordinal(2) // '2nd'
ordinal(3) // '3rd'
ordinal(4) // '4th'

ordinal(11) // '11th'
ordinal(12) // '12th'
ordinal(13) // '13th'

ordinal(21) // '21st'
ordinal(22) // '22nd'
ordinal(23) // '23rd'
ordinal(24) // '24th'
```

To get just the indicator:

``` javascript
var ordinal = require('ordinal')
var indicator = require('ordinal/indicator')

indicator(1) // 'st'
indicator(2) // 'nd'
indicator(3) // 'rd'
indicator(4) // 'th'

indicator(11) // 'th'
indicator(12) // 'th'
indicator(13) // 'th'

indicator(21) // 'st'
indicator(22) // 'nd'
indicator(23) // 'rd'
indicator(24) // 'th'
```

## License [ISC](LICENSE)
