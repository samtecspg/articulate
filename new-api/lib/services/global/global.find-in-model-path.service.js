import GlobalNotFound from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';
import RedisNotLinkedError from '../../errors/redis.not-linked-error';

module.exports = async function ({ modelPath, isFindById, isSingleResult, skip, limit, direction, field, filter, returnModel = false }) {

    //TODO: Needs refactoring, should handle a single function but is doing 3 different things

    const { redis } = this.server.app;
    let totalCount = 0;

    try {
        const findById = async ({ model, id }) => {

            try {
                const Model = await redis.factory(model, id);
                return await Model;
            }
            catch (err) {
                throw GlobalNotFound({ model, id });
            }

        };

        const reducer = async (parentModel, current, index, sourceArray) => {
            //the first one
            if (!parentModel) {
                // Load the model, wait for it to load and pass it
                return await findById(current);
            }
            const { model, id } = current;
            //wait for parent to load
            parentModel = await parentModel;

            // the last one in a find all or find a single model
            if (!id) {

                const ids = await parentModel.getAll(model, model);
                totalCount = ids.length;

                //if single result then only get the first one
                const childModel = await findById({ model, id: isSingleResult ? ids[0] : null });
                if (isSingleResult) {
                    if (childModel.inDb) {
                        return returnModel ? childModel : childModel.allProperties();
                    }
                    return Promise.reject(GlobalNotFound({ model }));
                }
                const allResultsModels = await childModel.findAllByIds({ ids, skip, limit, direction, field, filter });
                if (returnModel) {
                    return allResultsModels;
                }
                return allResultsModels.map((resultModel) => resultModel.allProperties());
            }

            //load child model
            const childModel = await findById(current);
            const belongs = await parentModel.belongsTo(childModel, model);
            if (belongs) {
                // the last one in a find by id else continue
                const isLast = sourceArray.length === (index + 1);
                if (isLast) {
                    return returnModel ? childModel : childModel.allProperties();
                }
                return childModel;
            }
            throw RedisNotLinkedError({
                mainType: parentModel.modelName,
                mainId: parentModel.id,
                subType: model,
                subId: current.id
            });
        };
        const data = await modelPath.reduce(reducer, null);
        if (isFindById || isSingleResult) {
            return { ...data };
        }

        return { data, totalCount };

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
