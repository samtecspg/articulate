import _ from 'lodash';
import Moment from 'moment';
import {
    RASA_ACTION_RANKING,
    RASA_MODEL_DOMAIN_RECOGNIZER
} from '../../../util/constants';

module.exports = async function (
    {
        AgentModel,
        text,
        trainedDomains,
        rasaURL = null
    }) {

    const { rasaNLUService } = await this.server.services();
    const agent = AgentModel.allProperties();

    let domainRecognizerTrainedDomain = _.filter(trainedDomains, (trainedDomain) => {

        return trainedDomain.model.indexOf(RASA_MODEL_DOMAIN_RECOGNIZER) > -1;
    });

    domainRecognizerTrainedDomain = domainRecognizerTrainedDomain.length > 0 ? domainRecognizerTrainedDomain[0] : null;
    let domainRecognitionResults;
    if (domainRecognizerTrainedDomain) {

        domainRecognitionResults = await rasaNLUService.parse({
            text,
            project: agent.agentName,
            trainedDomain: domainRecognizerTrainedDomain,
            baseURL: rasaURL
        });
    }
    return Promise.all(trainedDomains.map(async (trainedDomain) => {

        if (!domainRecognitionResults || trainedDomain.name !== domainRecognitionResults.domain) {

            const startTime = new Moment();
            let domainRasaResults = await rasaNLUService.parse({
                text,
                project: agent.agentName,
                trainedDomain,
                baseURL: rasaURL
            });
            const endTime = new Moment();
            const duration = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
            domainRasaResults = { ...domainRasaResults, ...{ elapsed_time_ms: duration } };
            if (domainRecognitionResults) {
                let domainScore = _.filter(domainRecognitionResults[RASA_ACTION_RANKING], (recognizedDomain) => {

                    return recognizedDomain.name === domainRasaResults.domain;
                });
                domainScore = domainScore.length > 0 ? domainScore[0].confidence : 0;
                domainRasaResults = { ...domainRasaResults, ... { domainScore } };
            }
            return domainRasaResults;
        }
    }));
};
