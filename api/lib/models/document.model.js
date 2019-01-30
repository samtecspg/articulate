import Joi from 'joi';

class DocumentModel {
    static get schema() {

        return {
            id: Joi
                .string()
                .description('Id')
                .trim(),
            document: Joi
                .string()
                .description('Document')
                .trim(),
            time_stamp: Joi
                .date()
                .description('Timestamp'),
            maximum_saying_score: Joi
                .number()
                .description('Maximum Saying Score'),
            maximum_domain_score: Joi
                .number()
                .description('Maximum Domain Score'),
            total_elapsed_time_ms: Joi
                .number()
                .description('Total Elapsed Time (ms)'),
            rasa_results: Joi
                .array()
                .items(Joi.object())
                .description('RASA Results'),
            session: Joi
                .string()
                .description('Session')
                .trim(),
            agent_id: Joi
                .number()
                .description('Agent Id'),
            agent_model: Joi
                .string()
                .description('Agent Model')
                .trim(),
            creationDate: Joi
                .string(),
            modificationDate: Joi
                .string(),
            webhookResponses: Joi
                .array().items(Joi.any())
        };
    };
}

module.exports = DocumentModel;
