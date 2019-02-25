"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cartesianProductOf = async function cartesianProductOf(entitiesList) {
  return await _lodash.default.reduce(entitiesList, (a, b) => {
    return _lodash.default.flatten(_lodash.default.map(a, x => {
      return _lodash.default.map(b, y => {
        return x.concat([y]);
      });
    }), true);
  }, [[]]);
};

module.exports = cartesianProductOf;
//# sourceMappingURL=global.tool-cartesian-product.service.js.map