import { PARAM_SESSION } from '../../util/constants';

const ContextModel = require('../models/context.model').schema;

class SettingsValidate {
    constructor() {

        this.findBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.session.required()
                };
            })()
        };
    }
}

const actionValidate = new SettingsValidate();
module.exports = actionValidate;
