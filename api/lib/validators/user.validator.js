import Joi from 'joi';
import {
    PARAM_EMAIL,
    PARAM_GROUPS,
    PARAM_IDENTITY,
    PARAM_LAST_NAME,
    PARAM_NAME,
    PARAM_PASSWORD,
    PARAM_PROFILE,
    PARAM_PROVIDER,
    PARAM_SALT,
    PARAM_SECRET,
    PARAM_TOKEN,
    PARAM_USER_ACCOUNT_ID
} from '../../util/constants';

const UserAccountModel = require('../models/user-account.model').schema;
const UserIdentityModel = require('../models/user-identity.model').schema;

const userIdentityParams = {
    [PARAM_PROVIDER]: UserIdentityModel.provider.required(),
    [PARAM_TOKEN]: UserIdentityModel.token.required(),
    [PARAM_SECRET]: UserIdentityModel.secret,
    [PARAM_PROFILE]: UserIdentityModel.profile.required()
};

const userAccountParams = {
    [PARAM_NAME]: UserAccountModel.name.required(),
    [PARAM_LAST_NAME]: UserAccountModel.lastName,
    [PARAM_EMAIL]: UserAccountModel.email.required(),
    [PARAM_PASSWORD]: UserAccountModel.password,
    [PARAM_SALT]: UserAccountModel.salt,
    [PARAM_PROVIDER]: Joi.string().trim().description('Provider').required(),
    [PARAM_IDENTITY]: Joi.object().optional().keys(userIdentityParams),
};

class UserValidate {
    constructor() {
        this.create = {
            payload: (() => {

                return userAccountParams;
            })()
        };

        this.createIdentity = {
            payload: (() => {

                return userIdentityParams;
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    [PARAM_USER_ACCOUNT_ID]: UserIdentityModel.id.required()
                };
            })()
        };

        this.validate = {
            payload: (() => {

                return {
                    [PARAM_EMAIL]: UserAccountModel.email.required(),
                    [PARAM_PASSWORD]: UserAccountModel.password.required()
                };
            })()
        };

        this.removeById = {
            params: (() => {

                return {
                    [PARAM_USER_ACCOUNT_ID]: UserIdentityModel.id.required()
                };
            })()
        };
        this.updateBbyId = {
            params: (() => {

                return {
                    [PARAM_USER_ACCOUNT_ID]: UserIdentityModel.id.required()
                };
            })(),
            payload: (() => {

                return {
                    [PARAM_NAME]: UserAccountModel.name.required(),
                    [PARAM_LAST_NAME]: UserAccountModel.lastName.required(),
                    [PARAM_EMAIL]: UserAccountModel.email.required(),
                    [PARAM_PASSWORD]: UserAccountModel.password,
                    [PARAM_GROUPS]: UserAccountModel.groups,
                };
            })()
        };
    }
}

module.exports = new UserValidate();
