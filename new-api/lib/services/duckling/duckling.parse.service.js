module.exports = async function (
    {
        text,
        timezone,
        language,
        baseURL = null
    }) {

    const { duckling } = this.server.app;
    const { ducklingService } = await this.server.services();

    const result = await duckling.parse({
        text,
        lang: language,
        tz: timezone,
        baseURL
    });
    return ducklingService.convertToInterval({ ducklingOutput: result, timezone });
};
