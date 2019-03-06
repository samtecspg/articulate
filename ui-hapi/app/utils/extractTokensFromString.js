import _ from 'lodash';

export default function({ text, tokens = [] }) {
  let remainingText = text;
  const reducer = (accumulator, currentValue) => {
    const regex = new RegExp(`${currentValue}:"(.*?)"`, 'gm');
    const results = [];
    let match;
    do {
      match = regex.exec(text);

      if (match) {
        results.push(match[1]);
        remainingText = _.replace(remainingText, match[0], '');
      }
    }
    while ((match !== null));

    return { ...accumulator, ...{ [currentValue]: results.length > 0 ? results : undefined } };
  };
  const found = tokens.reduce(reducer, {});
  return { remainingText: remainingText.trim(), found };
}
