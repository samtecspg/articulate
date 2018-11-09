import YAML from 'json2yaml';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function (
    {
        project,
        model,
        oldModel = null,
        trainingSet,
        pipeline,
        language,
        baseURL = null
    }) {

    const { [`rasa-nlu`]: rasaNLU } = this.server.app;

    try {
        const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
        let payload = {
            language,
            pipeline
        };
        payload = YAML.stringify(payload);
        payload += `  data: ${stringTrainingSet}`;
        await rasaNLU.Train({
            project,
            model,
            payload,
            baseURL
        });
        /*if (oldModel) {
            await rasaNLU.Models({
                project,
                model: oldModel,
                baseURL
            });
        }*/
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
