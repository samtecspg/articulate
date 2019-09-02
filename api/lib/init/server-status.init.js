import _ from 'lodash';
import { MODEL_SERVER } from '../../util/constants';
import serverInfo from '../../util/server-info';
import Package from '../../package.json';

module.exports = async (server) => {

    const { redis } = server.app;
    const { serverService, } = await server.services();

    const ServerModel = await serverService.get({ returnModel: true });
    
    serverInfo.version = Package.version;

    if (ServerModel && ServerModel.inDb){
        await serverService.update({ data: serverInfo });
    }
    else {
        await serverService.create({ data: serverInfo });

    }
};
