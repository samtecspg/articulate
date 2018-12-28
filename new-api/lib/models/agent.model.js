import Joi from 'joi';

class AgentModel {
    static get schema() {

        return {
            id: Joi.number(),
            agentName: Joi.string().trim(),
            description: Joi.string().trim(),
            language: Joi.string().trim().valid('en', 'es', 'de', 'fr', 'pt'),
            timezone: Joi.string().trim(),
            useWebhook: Joi.boolean(),
            usePostFormat: Joi.boolean(),
            multiCategory: Joi.boolean(),
            categoryClassifierThreshold: Joi.number(),
            fallbackResponses: Joi.array().items(Joi.string().trim()),
            status: Joi.string().trim(),
            lastTraining: Joi.date(),
            extraTrainingData: Joi.boolean(),
            enableModelsPerCategory: Joi.boolean(),
            model: Joi.string().allow(''),
            categoryRecognizer: Joi.boolean(),
            creationDate: Joi.string(),
            modificationDate: Joi.string()
        };
    };
}

module.exports = AgentModel;
