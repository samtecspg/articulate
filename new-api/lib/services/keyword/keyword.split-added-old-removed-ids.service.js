import _ from 'lodash';

module.exports = ({ oldKeywords, newKeywords }) => {

    const newIds = _.map(_(newKeywords).map('keywordId').uniq().value(), (id) => id.toString());
    const oldIds = _.map(_(oldKeywords).map('keywordId').uniq().value(), (id) => id.toString());

    const removed = _.difference(oldIds, newIds);
    const unchanged = _.intersection(oldIds, newIds);
    const previousKeywords = [...unchanged, ...removed];
    const added = _.difference(newIds, previousKeywords);

    const addedNonSystem = _(newKeywords)
        .filter((keyword) => !!!keyword.extractor) //Only Non system
        .filter((keyword) => _.includes(added, keyword.keywordId)) // Only new (ignore unchanged)
        .map((keyword) => keyword.keywordId.toString())
        .uniq()
        .value();

    return { added, addedNonSystem, removed, unchanged };
};
