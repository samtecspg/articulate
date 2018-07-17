'use strict';

module.exports = {
    action: require('../modules/action/config/action.route'),
    agent: require('../modules/agent/config/agent.route'),
    doc: require('../modules/doc/config/doc.route'),
    domain: require('../modules/domain/config/domain.route'),
    saying: require('../modules/saying/config/saying.route'),
    keyword: require('../modules/keyword/config/keyword.route'),
    context: require('../modules/context/config/context.route'),
    settings: require('../modules/settings/config/settings.route')
};
