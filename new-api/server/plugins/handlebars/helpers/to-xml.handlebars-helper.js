import Json2Xml from 'json2xml';

export const name = 'To XML (json2xml)';

export default ({ Handlebars }) => {

    Handlebars.registerHelper('toXML', (obj) => Json2Xml(obj));
};
