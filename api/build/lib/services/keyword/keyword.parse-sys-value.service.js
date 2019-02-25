"use strict";

var _constants = require("../../../util/constants");

module.exports = ({
  keyword,
  text
}) => {
  let value;

  switch (keyword.keyword) {
    case `${_constants.KEYWORD_PREFIX_SYS}${_constants.DUCKLING_TIME}`:
      value = {
        from: keyword.value.from.value,
        to: keyword.value.to.value
      };
      break;

    case `${_constants.KEYWORD_PREFIX_SYS}${_constants.DUCKLING_DISTANCE}`:
    case `${_constants.KEYWORD_PREFIX_SYS}${_constants.DUCKLING_TEMPERATURE}`:
    case `${_constants.KEYWORD_PREFIX_SYS}${_constants.DUCKLING_VOLUME}`:
      value = {
        value: keyword.value.value,
        unit: keyword.value.unit
      };
      break;

    case `${_constants.KEYWORD_PREFIX_SYS}${_constants.DUCKLING_DURATION}`:
      value = {
        value: keyword.value.value,
        unit: keyword.value.unit,
        normalized: {
          value: keyword.value.normalized.value,
          unit: keyword.value.normalized.unit
        }
      };
      break;

    case `${_constants.KEYWORD_PREFIX_SYS}${_constants.DUCKLING_QUANTITY}`:
      value = {
        value: keyword.value.value,
        unit: keyword.value.unit,
        product: keyword.value.product
      };
      break;

    case `${_constants.KEYWORD_PREFIX_SYS}${_constants.DUCKLING_URL}`:
      value = {
        value: keyword.value.value,
        category: keyword.value.category
      };
      break;

    default:
      value = {
        value: keyword.value.value
      };
      break;
  }

  value.original = text.substring(keyword.start, keyword.end);
  return value;
};
//# sourceMappingURL=keyword.parse-sys-value.service.js.map