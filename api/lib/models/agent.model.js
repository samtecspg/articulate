import Joi from 'joi';

class AgentModel {
    static get schema() {

        return {
            id: Joi.number(),
            gravatar: Joi.number(),
            uiColor: Joi.string().trim(),
            agentName: Joi.string().trim(),
            description: Joi.string().trim(),
            language: Joi.string().trim(),
            timezone: Joi.string().trim(),
            useWebhook: Joi.boolean(),
            usePostFormat: Joi.boolean(),
            multiCategory: Joi.boolean(),
            categoryClassifierThreshold: Joi.number(),
            fallbackAction: Joi.string().trim(),
            status: Joi.string().trim(),
            lastTraining: Joi.alternatives().try(Joi.date(), Joi.string().trim().allow('')),
            extraTrainingData: Joi.boolean(),
            enableModelsPerCategory: Joi.boolean(),
            model: Joi.string().allow(''),
            categoryRecognizer: Joi.boolean(),
            modifiersRecognizer: Joi.boolean(),
            modifiersRecognizerJustER: Joi.string().allow(''),
            creationDate: Joi.string(),
            modificationDate: Joi.string(),
            parameters: Joi.object()
        };
    };
}

module.exports = AgentModel;
