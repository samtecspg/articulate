'use strict';

module.exports = {
    agent: require('../modules/agent/config/agent.route'),
    domain: require('../modules/domain/config/domain.route'),
    intent: require('../modules/intent/config/intent.route'),
    entity: require('../modules/entity/config/entity.route'),
    context: require('../modules/context/config/context.route')
};
