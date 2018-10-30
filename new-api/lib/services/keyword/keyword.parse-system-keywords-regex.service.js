import _ from 'lodash';
module.exports = function ({ regexData }) {

    return _.map(regexData, (keyword) => {

        let tmpKeyword = {};
        if (keyword.regexType === 'sysRegex') {
            tmpKeyword = {
                end: keyword.end,
                keyword: 'sys.regex_' + keyword.name,
                extractor: 'regex',
                start: keyword.start,
                value: keyword.resolvedRegex
            };
        }
        else if (keyword.regexType === 'keywordRegex') {
            tmpKeyword = {
                end: keyword.end,
                keyword: keyword.name,
                extractor: 'regex',
                start: keyword.start,
                value: keyword.keywordValue
            };
        }
        return tmpKeyword;
    });
};
