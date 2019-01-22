import Helpers from 'handlebars-helpers';

export const name = 'Misc Handlebars (handlebars-helpers)';

const helpers = [
    'array',
    'collection',
    'comparison',
    'inflection',
    'math',
    'misc',
    'number',
    'object',
    'string',
    'url'
];
export default ({ Handlebars }) => {

    Helpers(helpers, {
        handlebars: Handlebars
    });
};
