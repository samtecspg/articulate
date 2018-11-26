import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ AgentModel, field, model, value }
) {

    const { globalService } = await this.server.services();

    try {

        const Models = await globalService.searchByField({ field, value, model });
        return Models && Models.length === 0 ? true : !await AgentModel.belongsTo(Models[0], model);
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
