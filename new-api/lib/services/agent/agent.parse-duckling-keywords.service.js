import Moment from 'moment';

module.exports = async function ({ AgentModel, text, timezone, ducklingURL }) {

    const { ducklingService } = await this.server.services();

    const startTime = new Moment();
    timezone = timezone || AgentModel.property('timezone');
    const ducklingParseResponse = await ducklingService.parse({
        text,
        timezone,
        language: AgentModel.property('language'),
        baseURL: ducklingURL
    });
    const endTime = new Moment();
    const duration = Moment.duration(endTime.diff(startTime).asMilliseconds());
    return ducklingParseResponse.map((ducklingParse) => {

        return { ...ducklingParse, ...{ elapsed_time_ms: duration / ducklingParseResponse.length } };
    });
};
