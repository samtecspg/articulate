import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_KEYWORD
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import FastStringSearch from 'fast-string-search';

module.exports = async function ({ id, AgentModel, text, customValues = [] }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    const punctuation = [' ', ',', '.', ';', '?', '!', '¿', '...', '"'];

    try {

        AgentModel = AgentModel || await redis.factory(MODEL_AGENT, id);

        const allKeywords = customValues.length > 0 ? customValues : await globalService.loadAllByIds({ ids: await AgentModel.getAll(MODEL_KEYWORD, MODEL_KEYWORD), model: MODEL_KEYWORD });
        const assignedStartIndex = [];
        let highlightedKeywords = _.flatten(_.map(allKeywords, (keyword) => {

            //Get a list of the values that represent the keyword sorted descending by value length
            const values = customValues.length > 0 ? _.sortBy(_.flattenDeep(keyword.synonyms), (value) => -value.length) :
                _.sortBy(_.flattenDeep(_.map(keyword.examples, ('synonyms'))), (value) => -value.length);
            //Identify if the value is in the user saying
            const recognizedKeywords = _.flatten(_.compact(_.map(values, (value) => {
                const startIndexes = FastStringSearch.indexOf(text.toLowerCase(), value.toLowerCase());
                return _.compact(_.map(startIndexes, (start) => {
                    //If the value is in the user saying and also that start haven't been assigned
                    if (assignedStartIndex.indexOf(start) === -1) {
                        const end = start + value.length;
                        if (start === 0 && (!text[end] || punctuation.indexOf(text[end]) !== -1) || ((!text[start - 1] || punctuation.indexOf(text[start - 1]) !== -1) && (!text[end] || punctuation.indexOf(text[end]) !== -1))) {
                            //Mark the start index as assigned and create the new keyword, and also, add every index between start and end
                            for (let i = start; i <= end; i++) {
                                assignedStartIndex.push(i);
                            }
                            return {
                                start,
                                end,
                                value,
                                keyword: keyword.keywordName,
                                keywordId: parseInt(keyword.id)
                            }
                        }
                    }
                    return null;
                }));
            })));
            return recognizedKeywords
        }));
        return _.orderBy(highlightedKeywords, 'start', 'asc');
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
