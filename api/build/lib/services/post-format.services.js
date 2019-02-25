"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _postFormatCreate = _interopRequireDefault(require("./post-format/post-format.create.service"));

var _postFormatFindAllByIds = _interopRequireDefault(require("./post-format/post-format.find-all-by-ids.service"));

var _postFormatRemove = _interopRequireDefault(require("./post-format/post-format.remove.service"));

var _postFormatUpdateById = _interopRequireDefault(require("./post-format/post-format.update-by-id.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class PostFormatService extends _schmervice.default.Service {
  async create() {
    return await _postFormatCreate.default.apply(this, arguments);
  }

  async findAllByIds() {
    return await _postFormatFindAllByIds.default.apply(this, arguments);
  }

  async updateById() {
    return await _postFormatUpdateById.default.apply(this, arguments);
  }

  async remove() {
    return await _postFormatRemove.default.apply(this, arguments);
  }

};
//# sourceMappingURL=post-format.services.js.map