import _ from 'lodash';

module.exports = function ({ ducklingData, ducklingDimension }) {

    const replacer = (key, value) => {

        if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return value.toString();
        }
        return value;
    };
    const ducklingKeywords = _.map(ducklingData, (keyword) => {

        if (ducklingDimension.indexOf(keyword.dim) !== -1) {
            return {
                end: keyword.end,
                keyword: 'sys.duckling_' + keyword.dim,
                extractor: 'duckling',
                start: keyword.start,
                value: JSON.parse(JSON.stringify(keyword.value, replacer))
            };
        }
        return null;
    });
    return _.compact(ducklingKeywords);

};
