import Joi from 'joi';

class PostFormat {
    static get schema() {

        return {
            id: Joi.number(),
            postFormatPayload: Joi.string().trim(),
            creationDate: Joi
                .string(),
            modificationDate: Joi
                .string()
        };
    };
}

module.exports = PostFormat;
