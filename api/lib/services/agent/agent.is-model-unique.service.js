import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ AgentModel, field, model, value }
) {

    const { globalService } = await this.server.services();

    try {

        const Models = await globalService.searchByField({ field, value, model });
        if (Models){
            if (Models.length === 0){
                return true;
            }
            else {

                const validation = await Promise.all(Models.map(async (tempModel) => {

                    return await AgentModel.belongsTo(tempModel, model);
                }));

                return validation.indexOf(true) === -1;
            }
        }
        else {
            return true;
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
