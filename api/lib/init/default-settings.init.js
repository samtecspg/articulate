import _ from 'lodash';
import defaultSettings from '../../util/default-settings';
import { MODEL_CONTEXT } from '../../util/constants';

module.exports = async (server) => {

    const { redis } = server.app;
    const { settingsService, contextService } = await server.services();
    const CurrentSettings = await settingsService.findAll();


    await Promise.all(_.map(defaultSettings, async (value, name) => {

        if (CurrentSettings[name]) {
            return;
        }
        return await settingsService.create({ data: { name, value } });
    }));

    const Model = await redis.factory(MODEL_CONTEXT);
    const sessionId = defaultSettings.defaultUISessionId;
    await Model.findBySessionId({ sessionId });

    if (!Model.inDb) {
        await contextService.create({ data: { sessionId } });
    }
};
