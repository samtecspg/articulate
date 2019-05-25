const Crypto = require('crypto');
export const name = 'Date Time Format (Moment)';

export default ({ Handlebars }) => {

    Handlebars.registerHelper('md5', (string) => Crypto.createHash('md5').update(string).digest("hex"));
};
