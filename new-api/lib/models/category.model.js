import Joi from 'joi';
import {
    STATUS_ERROR,
    STATUS_OUT_OF_DATE,
    STATUS_READY,
    STATUS_TRAINING
} from '../../util/constants';

class CategoryModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string().trim(),
            categoryName: Joi.string().trim(),
            enabled: Joi.boolean(),
            actionThreshold: Joi.number(),
            status: Joi
                .string()
                .trim()
                .valid(STATUS_READY, STATUS_TRAINING, STATUS_ERROR, STATUS_OUT_OF_DATE),
            lastTraining: Joi.date().allow(''),
            model: Joi.string().trim().allow(''),
            extraTrainingData: Joi.boolean(),
            creationDate: Joi.string(),
            modificationDate: Joi.string()
        };
    };
}

module.exports = CategoryModel;
