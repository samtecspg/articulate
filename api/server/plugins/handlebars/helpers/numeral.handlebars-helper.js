const Numeral = require('numeral');
import _ from 'lodash';

export const name = 'Numeral';

_.assign(Numeral.localeData('en'), {
  abbreviations: {
      thousand: "K",
      million: "M",
      billion: "B",
      trillion: "T"
  }
});

export default ({ Handlebars }) => {

  Handlebars.registerHelper('numeral', (number, format) => {
    return Numeral(number).format(format);
  });

};
