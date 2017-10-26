'use strict';

module.exports = {
    agent: require('../modules/agent/config/agent.route'),
    domain: require('../modules/domain/config/domain.route'),
    intent: require('../modules/intent/config/intent.route'),
    scenario: require('../modules/scenario/config/scenario.route'),
    entity: require('../modules/entity/config/entity.route')
};
