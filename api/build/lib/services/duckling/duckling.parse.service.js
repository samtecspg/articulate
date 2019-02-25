"use strict";

module.exports = async function ({
  text,
  timezone,
  language,
  baseURL = null
}) {
  const duckling = this.server.app.duckling;

  const _ref = await this.server.services(),
        ducklingService = _ref.ducklingService;

  const result = await duckling.Parse({
    payload: {
      text,
      lang: language,
      tz: timezone
    },
    baseURL
  });
  return ducklingService.convertToInterval({
    ducklingOutput: result,
    timezone
  });
};
//# sourceMappingURL=duckling.parse.service.js.map