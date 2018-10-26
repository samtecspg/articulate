import _ from 'lodash';
import RedisErrorHandler from '../../errors/redis.error-handler';
import RedisNotLinkedError from '../../errors/redis.not-linked-error';

module.exports = async function ({ modelPath = [], ids = [], returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const models = {};
        const reducer = async (parent, current, index) => {

            if (!parent) {
                models[current] = await redis.factory(current, ids[index]);
                return models[current];
            }
            parent = await parent;
            models[current] = await redis.factory(current, ids[index]);

            const belongs = await parent.belongsTo(models[current], current);
            if (belongs) {
                return models[current];
            }
            throw RedisNotLinkedError({
                mainType: parent.modelName,
                mainId: parent.id,
                subType: current,
                subId: current.id
            });
        };

        await modelPath.reduce(reducer, null);
        if (returnModel) {
            return models;
        }

        return _.map(models, (model) => model.allProperties());
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Can't find models in the path '${modelPath.join('->')}' with the ids '${ids.join(',')}'` });
    }
};
