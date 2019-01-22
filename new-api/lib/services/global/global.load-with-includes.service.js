import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ model, id, relationNames = [] }) {

    const { redis } = this.server.app;

    try {
        const Model = await redis.factory(model, id);
        const props = Model.allProperties();
        relationNames.forEach((relationName) => {
            props[relationName] = [];
        });
        await Promise.all(relationNames.map(async (relationName) => {

            const RelationModel = await redis.factory(relationName);
            const ids = await Model.getAll(relationName, relationName);
            const results = await RelationModel.loadAllByIds({ ids });
            props[relationName].push(...results.map((r) => r.allProperties()));
        }));

        return props;
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${model} error loading linked models` });
    }
};
