import {
    MODEL_ACTION,
    MODEL_KEYWORD,
    MODEL_SAYING,
    ROUTE_KEYWORD
} from '../../util/constants';
import GlobalFindAll from './global/global.find-all.route';
import GlobalFindById from './global/global.find-by-id.route';
import GlobalFindInModelPath from './global/global.find-in-model-path.route';

module.exports = [
    GlobalFindAll({ ROUTE: ROUTE_KEYWORD }),
    GlobalFindById({ ROUTE: ROUTE_KEYWORD }),
    GlobalFindInModelPath({ models: [MODEL_KEYWORD, MODEL_ACTION] }),
    GlobalFindInModelPath({ models: [MODEL_KEYWORD, MODEL_SAYING] })
];
