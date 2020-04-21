import Joi from 'joi';

class UserAccountModel {
    static get schema() {

        return {
            id: Joi.number(),
            name: Joi.string().trim().description('Name'),
            lastName: Joi.string().allow('').trim().description('Last name'),
            email: Joi.string().trim().description('Email'),
            password: Joi.string().description('Password'),
            salt: Joi.any().forbidden().strip().description('Salt'),
            isActive: Joi.boolean().description('User Status'),
            groups: Joi.array().items(Joi.string().trim()).description('Access Control Groups'),
            creationDate: Joi.date().description('Creation Date'),
            modificationDate: Joi.date().description('Modification Date')
        };
    };

    static get responseSchema() {

        return Joi.object().keys({
            ...this.schema, ...{
                password: Joi.strip().forbidden(),
                salt: Joi.strip().forbidden(),
                simplifiedGroupPolicies: Joi.object().optional()
            }
        });
    };
}

module.exports = UserAccountModel;
