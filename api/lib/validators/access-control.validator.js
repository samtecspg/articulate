import {
    PARAM_GROUP_NAME,
    PARAM_RULES
} from '../../util/constants';

const AccessControlSchema = require('../models/access-control.model').schema;

class AccessControlValidate {
    constructor() {

        this.createGroup = {
            payload: (() => {

                return {
                    [PARAM_GROUP_NAME]: AccessControlSchema.name.required(),
                    [PARAM_RULES]: AccessControlSchema.rules.required()
                };
            })()
        };

        this.updateGroup = {
            params: (() => {

                return {
                    [PARAM_GROUP_NAME]: AccessControlSchema.name.required()
                };
            })(),
            payload: AccessControlSchema.rules.required()
        };

        this.remove = {
            params: (() => {

                return {
                    [PARAM_GROUP_NAME]: AccessControlSchema.name.required()
                };
            })()
        };

        this.findByName = {
            params: (() => {

                return {
                    [PARAM_GROUP_NAME]: AccessControlSchema.name.required()
                };
            })()
        };
    }
}

const accessControlValidate = new AccessControlValidate();
module.exports = accessControlValidate;
