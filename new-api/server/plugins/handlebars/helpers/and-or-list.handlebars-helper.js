export const name = 'And/Or List';

export default ({ Handlebars }) => {

    const buildListOfWords = (words, separator) => {

        if (!Array.isArray(words)) {
            return words;
        }
        if (words.length === 1) {
            return words[0];
        }
        if (words.length === 2) {
            return words[0] + ' ' + separator + ' ' + words[1];
        }
        return words.slice(0, words.length - 1).join(', ') + ', ' + separator + ' ' + words[words.length - 1];
    };

    Handlebars.registerHelper('andList', (words) => {

        return buildListOfWords(words, 'and');
    });

    Handlebars.registerHelper('orList', (words) => {

        return buildListOfWords(words, 'or');
    });
};
