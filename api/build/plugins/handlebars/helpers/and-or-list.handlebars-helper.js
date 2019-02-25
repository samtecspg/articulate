"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.name = void 0;
const name = 'And/Or List';
exports.name = name;

var _default = ({
  Handlebars
}) => {
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

  Handlebars.registerHelper('andList', words => {
    return buildListOfWords(words, 'and');
  });
  Handlebars.registerHelper('orList', words => {
    return buildListOfWords(words, 'or');
  });
};

exports.default = _default;
//# sourceMappingURL=and-or-list.handlebars-helper.js.map