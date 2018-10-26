import _ from 'lodash';

module.exports = ({ oldKeywords, newKeywords }) => {

    const newIds = _(newKeywords).map('keywordId').uniq().value();
    const oldIds = _(oldKeywords).map('keywordId').uniq().value();

    const removed = _.difference(oldIds, newIds);
    const unchanged = _.intersection(oldIds, newIds);
    const added = _.difference(newIds, [...unchanged, ...removed]);

    const addedNonSystem = _(newKeywords)
        .filter((keyword) => !!!keyword.extractor) //Only Non system
        .filter((keyword) => _.includes(added, keyword.keywordId)) // Only new (ignore unchanged)
        .map((keyword) => keyword.keywordId)
        .uniq()
        .value();

    return { added, addedNonSystem, removed, unchanged };
};
