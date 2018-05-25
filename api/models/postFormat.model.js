'use strict';

const Joi = require('joi');

class PostFormat {
    static get schema() {

        return {
            id: Joi.string().trim(),
            postFormatPayload: Joi.string().trim()
        };
    };
}

module.exports = PostFormat;
