import _ from 'lodash';

module.exports = async function ({ parseResult, spacyPretrainedEntities, ducklingDimension, requestId = null }) {

    const { keywordService } = await this.server.services();
    const ducklingKeywords = keywordService.parseSystemKeywordsDuckling({ ducklingData: parseResult.duckling, ducklingDimension, requestId });
    const regexKeywords = keywordService.parseSystemKeywordsRegex({ regexData: parseResult.regex, requestId });

    return _.map(parseResult.rasa, (rasaResult) => {

        let rasaKeywords = _.map(rasaResult.keywords, (keyword) => {

            if (keyword.extractor === 'ner_spacy') {
                if (spacyPretrainedEntities.indexOf(keyword.keyword) !== -1) {
                    keyword.keyword = 'sys.spacy_' + keyword.keyword.toLowerCase();
                }
                else {
                    return null;
                }
            }
            keyword.value = {
                value: keyword.value
            };
            return keyword;
        });

        rasaKeywords = _.compact(rasaKeywords);
        //TODO: IF there is more than one rasa result then this will contain repeated data
        rasaResult.keywords = _.union(rasaKeywords, ducklingKeywords, regexKeywords);

        return rasaResult;
    });
};
