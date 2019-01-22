import HandlebarsIntl from 'handlebars-intl';

export const name = 'Handlebars internationalization';

export default ({ Handlebars }) => {

    HandlebarsIntl.registerWith(Handlebars);

};
