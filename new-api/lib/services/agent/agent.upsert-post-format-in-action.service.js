import {
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_POST_FORMAT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, actionId, postFormatData, returnModel = false }) {

    const { globalService, postFormatService } = await this.server.services();

    try {
        const modelPath = [
            { model: MODEL_AGENT, id },
            { model: MODEL_ACTION, id: actionId }
        ];
        let actionModel = await globalService.findInModelPath({ modelPath, returnModel: true });
        actionModel = actionModel.data;
        const children = await actionModel.getAll(MODEL_POST_FORMAT, MODEL_POST_FORMAT);
        if (children.length > 0) { // Update
            return await postFormatService.updateById({
                id: children[0],
                data: postFormatData,
                returnModel
            });

        } // Create

        return await postFormatService.create({
            data: postFormatData,
            parent: actionModel,
            returnModel
        });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
