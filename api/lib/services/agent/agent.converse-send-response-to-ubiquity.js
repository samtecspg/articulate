import {
    ROUTE_AGENT,
    ROUTE_CONVERSE
} from '../../../util/constants';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function ({ CSO, response }) {

    const { channelService } = await this.server.services();

    if (CSO.ubiquity && CSO.ubiquity.connection && CSO.ubiquity.connection.details.outgoingMessages){

        channelService.reply({ connection: CSO.ubiquity.connection, event: CSO.ubiquity.event, response });
        await timeout(CSO.ubiquity.connection.details.waitTimeBetweenMessages);
    }
    else {
        this.server.publish(`/${ROUTE_AGENT}/${CSO.agent.id}/${ROUTE_CONVERSE}`, response );
    }
};