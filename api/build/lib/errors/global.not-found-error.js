"use strict";

module.exports = ({
  model,
  id
}) => {
  const message = `${model}${id ? `id=[${id}]` : ''} not found`;
  return {
    isHandled: true,
    statusCode: 404,
    message
  };
};
//# sourceMappingURL=global.not-found-error.js.map