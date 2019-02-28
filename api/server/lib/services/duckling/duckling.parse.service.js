module.exports = async function (
    {
        text,
        timezone,
        language,
        baseURL = null,
        requestId = null
    }) {

    const { duckling } = this.server.app;
    const { ducklingService } = await this.server.services();

    const result = await duckling.Parse({
        payload: {
            text,
            lang: language,
            tz: timezone
        },
        baseURL,
        requestId
    });
    return ducklingService.convertToInterval({ ducklingOutput: result, timezone, requestId });
};
