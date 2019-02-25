"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _settingsCreate = _interopRequireDefault(require("./settings/settings.create.service"));

var _settingsFindAll = _interopRequireDefault(require("./settings/settings.find-all.service"));

var _settingsFindByName = _interopRequireDefault(require("./settings/settings.find-by-name.service"));

var _settingsUpdateByName = _interopRequireDefault(require("./settings/settings.update-by-name.service"));

var _settingsBulkCreateSettings = _interopRequireDefault(require("./settings/settings.bulk-create-settings.service"));

var _settingsBulkUpdateSettings = _interopRequireDefault(require("./settings/settings.bulk-update-settings.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class SettingsService extends _schmervice.default.Service {
  async create() {
    return await _settingsCreate.default.apply(this, arguments);
  }

  async findAll() {
    return await _settingsFindAll.default.apply(this, arguments);
  }

  async findByName() {
    return await _settingsFindByName.default.apply(this, arguments);
  }

  async updateByName() {
    return await _settingsUpdateByName.default.apply(this, arguments);
  }

  async bulkCreate() {
    return await _settingsBulkCreateSettings.default.apply(this, arguments);
  }

  async bulkUpdate() {
    return await _settingsBulkUpdateSettings.default.apply(this, arguments);
  }

};
//# sourceMappingURL=settings.services.js.map