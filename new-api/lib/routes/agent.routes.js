import _ from 'lodash';
import {
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_POST_FORMAT,
    MODEL_SAYING,
    MODEL_WEBHOOK,
    ROUTE_AGENT
} from '../../util/constants';
import GlobalFindAll from './global/global.find-all.route';
import GlobalFindById from './global/global.find-by-id.route';
import GlobalFindInModelPath from './global/global.find-in-model-path.route';
import GlobalSearchByField from './global/global.search-by-field.route';

const Routes = require('require-dir')('./agent');

module.exports = [
    ..._.values(Routes),
    GlobalFindAll({ ROUTE: ROUTE_AGENT }),
    GlobalFindById({ ROUTE: ROUTE_AGENT }),
    GlobalSearchByField({ ROUTE: ROUTE_AGENT }),
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_ACTION] }), //agent/{agentId}/action
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_ACTION], isFindById: true }), //agent/{agentId}/action/{actionId}
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_ACTION, MODEL_POST_FORMAT], isSingleResult: true }), //agent/{agentId}/action/{actionId}/postFormat
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_ACTION, MODEL_WEBHOOK], isSingleResult: true }), //agent/{agentId}/action/{actionId}/webhook
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_CATEGORY] }), //agent/{agentId}/category
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_CATEGORY], isFindById: true }), //agent/{agentId}/category/{categoryId}
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_CATEGORY, MODEL_SAYING] }), //agent/{agentId}/category/{categoryId}/saying
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_CATEGORY, MODEL_SAYING], isFindById: true }), //agent/{agentId}/category/{categoryId}/saying/{sayingId}
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_KEYWORD] }), //agent/{agentId}/keyword
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_KEYWORD], isFindById: true }), //agent/{agentId}/keyword/{keywordId}
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_KEYWORD, MODEL_ACTION] }),//agent/{agentId}/keyword/{keywordId}/action
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_KEYWORD, MODEL_SAYING] }),//agent/{agentId}/keyword/{keywordId}/saying
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_WEBHOOK], isSingleResult: true }), //agent/{agentId}/webhook
    GlobalFindInModelPath({ models: [MODEL_AGENT, MODEL_POST_FORMAT], isSingleResult: true })  //agent/{agentId}/postFormat
];
