import _ from 'lodash';
import Moment from 'moment';
import {
    RASA_ACTION_RANKING,
    RASA_MODEL_CATEGORY_RECOGNIZER
} from '../../../util/constants';

module.exports = async function (
    {
        AgentModel,
        text,
        trainedCategories,
        rasaURL = null
    }) {

    const { rasaNLUService } = await this.server.services();
    const agent = AgentModel.allProperties();

    let categoryRecognizerTrainedCategory = _.filter(trainedCategories, (trainedCategory) => {

        return trainedCategory.model.indexOf(RASA_MODEL_CATEGORY_RECOGNIZER) > -1;
    });

    categoryRecognizerTrainedCategory = categoryRecognizerTrainedCategory.length > 0 ? categoryRecognizerTrainedCategory[0] : null;
    let categoryRecognitionResults;
    if (categoryRecognizerTrainedCategory) {

        categoryRecognitionResults = await rasaNLUService.parse({
            text,
            project: agent.agentName,
            trainedCategory: categoryRecognizerTrainedCategory,
            baseURL: rasaURL
        });
    }

    const rasaResults = await Promise.all(trainedCategories.map(async (trainedCategory) => {

        if (!categoryRecognitionResults || trainedCategory.name !== categoryRecognitionResults.category) {

            const startTime = new Moment();
            let categoryRasaResults = await rasaNLUService.parse({
                text,
                project: agent.agentName,
                trainedCategory,
                baseURL: rasaURL
            });
            const endTime = new Moment();
            const duration = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
            categoryRasaResults = { ...categoryRasaResults, ...{ elapsed_time_ms: duration } };
            if (categoryRecognitionResults) {
                let categoryScore = _.filter(categoryRecognitionResults[RASA_ACTION_RANKING], (recognizedCategory) => {

                    return recognizedCategory.name === categoryRasaResults.category;
                });
                categoryScore = categoryScore.length > 0 ? categoryScore[0].confidence : 0;
                categoryRasaResults = { ...categoryRasaResults, ... { categoryScore } };
            }
            else {
                categoryRasaResults = { ...categoryRasaResults, ... { categoryScore: 1 } };
            }
            return categoryRasaResults;
        }
    }));

    return rasaResults;
};
