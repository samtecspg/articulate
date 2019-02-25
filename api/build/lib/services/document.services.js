"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _documentCreate = _interopRequireDefault(require("./document/document.create.service"));

var _documentFindByAgentId = _interopRequireDefault(require("./document/document.find-by-agent-id.service"));

var _documentFindByIdService = _interopRequireDefault(require("./document/document.find-by-id.service.js"));

var _documentRemove = _interopRequireDefault(require("./document/document.remove.service"));

var _documentSearch = _interopRequireDefault(require("./document/document.search.service"));

var _documentUpdate = _interopRequireDefault(require("./document/document.update.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class DocumentService extends _schmervice.default.Service {
  async create() {
    return await _documentCreate.default.apply(this, arguments);
  }

  async update() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _documentUpdate.default,
      name: 'DocumentService.update'
    }).apply(this, arguments);
  }

  async remove() {
    return await _documentRemove.default.apply(this, arguments);
  }

  async findById() {
    return await _documentFindByIdService.default.apply(this, arguments);
  }

  async search() {
    return await _documentSearch.default.apply(this, arguments);
  }

  async findByAgentId() {
    return await _documentFindByAgentId.default.apply(this, arguments);
  }

};
//# sourceMappingURL=document.services.js.map