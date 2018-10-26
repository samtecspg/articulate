import Joi from 'joi';
import {
    STATUS_ERROR,
    STATUS_OUT_OF_DATE,
    STATUS_READY,
    STATUS_TRAINING
} from '../../util/constants';

class DomainModel {
    static get schema() {

        return {
            id: Joi.string(), // using UUID on redis
            agent: Joi.string().trim(),
            domainName: Joi.string().trim(),
            enabled: Joi.boolean(),
            actionThreshold: Joi.number(),
            status: Joi
                .string()
                .trim()
                .valid(STATUS_READY, STATUS_TRAINING, STATUS_ERROR, STATUS_OUT_OF_DATE),
            lastTraining: Joi.date(),
            model: Joi.string().trim(),
            extraTrainingData: Joi.boolean()
        };
    };
}

module.exports = DomainModel;
