import _ from 'lodash';
import { MODEL_KEYWORD } from '../../../util/constants';

module.exports = async function ({ AgentModel, text }) {

    const { globalService } = await this.server.services();
    const keywords = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_KEYWORD });
    const regexs = [];
    keywords.forEach((keyword) => {

        if (keyword.regex && keyword.regex !== '' && keyword.type !== 'regex') {
            regexs.push({ name: keyword.keywordName, pattern: keyword.regex, keywordType: keyword.type });
        }
        if (keyword.type === 'regex') {

            regexs.push({ name: keyword.keywordName, examples: keyword.examples, keywordType: keyword.type });
        }
    });
    const regexKeywords = [];
    regexs.forEach((regex) => {

        if (regex.pattern) {
            const regexToTest = new RegExp(regex.pattern, 'i');
            if (regexToTest.test(text)) {
                const resultParsed = regexToTest.exec(text);
                const startIndex = text.indexOf(resultParsed[0]);
                const endIndex = startIndex + resultParsed[0].length;
                const resultToSend = Object.assign(regex, { resolvedRegex: resultParsed[0], start: startIndex, end: endIndex, regexType: 'sysRegex' });
                regexKeywords.push(_.cloneDeep(resultToSend));
            }
        }
        if (regex.keywordType === 'regex') {
            regex.examples.forEach((regexExample) => {

                const keywordValue = regexExample.value;
                if (regexExample.synonyms.indexOf(keywordValue) < 0) {
                    regexExample.synonyms.push(keywordValue);
                }
                const foundRegex = [];
                regexExample.synonyms.forEach((syn) => {

                    const regexToTest = new RegExp(syn, 'ig');
                    let match;

                    if (match = regexToTest.exec(text)) {

                        while (match) {
                            if (foundRegex.indexOf(match) < 0) {
                                const startIndex = text.indexOf(match[0]);
                                const endIndex = startIndex + match[0].length;
                                const resultToSend = Object.assign(regex, { resolvedRegex: match[0], keywordValue, start: startIndex, end: endIndex, regexType: 'keywordRegex' });
                                regexKeywords.push(_.cloneDeep(resultToSend));
                                foundRegex.push(match[0]);
                                match = regexToTest.exec(text);

                            }
                        }
                    }

                });
            });
        }
    });
    return regexKeywords;
};
