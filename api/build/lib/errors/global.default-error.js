"use strict";

module.exports = ({
  statusCode = 500,
  message
}) => {
  return {
    isHandled: true,
    statusCode,
    message
  };
};
//# sourceMappingURL=global.default-error.js.map