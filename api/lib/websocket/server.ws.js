import {
    NOHM_SUB_SAVE,
    MODEL_SERVER
} from '../../util/constants';

module.exports = {
    model: MODEL_SERVER,
    subscribePath: '/',
    publishPath: () => '/',
    actions: [NOHM_SUB_SAVE]
};
