import Joi from 'joi';

class PostFormat {
    static get schema() {

        return {
            id: Joi.number(),
            postFormatPayload: Joi.string().trim()
        };
    };
}

module.exports = PostFormat;
