import Joi from 'joi';

class AccessControlGroupModel {
    static get schema() {

        return {
            id: Joi.number(),
            name: Joi.string().trim().description('Name'),
            rules: Joi.object().description('Rules')
        };
    };
}

module.exports = AccessControlGroupModel;
