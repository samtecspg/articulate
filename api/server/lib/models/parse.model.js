import Joi from 'joi';

class ParseModel {
    static get schema() {

        return {
            text: Joi.string().description('Text to parse'),
            timezone: Joi.string().description('Timezone for duckling parse. Default UTC')
        };
    };
}

module.exports = ParseModel;
