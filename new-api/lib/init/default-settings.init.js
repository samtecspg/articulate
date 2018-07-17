import _ from 'lodash';
import defaultSettings from '../../util/default-settings';

module.exports = async (server) => {

    const { settingsService } = await server.services();
    const CurrentSettings = await settingsService.findAll();

    await Promise.all(_.map(defaultSettings, async (value, name) => {

        if (CurrentSettings[name]) {
            return;
        }
        return await settingsService.create({ data: { name, value } });
    }));
};
