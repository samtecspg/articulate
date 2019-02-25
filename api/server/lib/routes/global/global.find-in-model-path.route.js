import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import {
    MODEL_TO_ROUTE,
    PARAMS_POSTFIX_ID
} from '../../../util/constants';
import GlobalValidator from '../../validators/global.validator';

//const logger = require('../../../server/util/logger')({ name: `route:global:find-all-related-models-in-path` });

const validateConfiguration = ({ models, isFindById, isSingleResult }) => {

    if (!_.isArray(models) || models.length < 2) {
        throw new Error('A related model path needs an array of at least 2 models');
    }

    if (isFindById && isSingleResult) {
        throw new Error('Route can\'t be configured findById and isSingleResult at the same time: \n' +
            'isFindById: false && isSingleResult: false -> (Find all linked models)         -> /{model}\n' +
            'isFindById: false && isSingleResult: true  -> (Find single linked model)       -> /{model}\n' +
            'isFindById: true  && isSingleResult: false -> (Find single linked model by id) -> /{model}/{modelId}\n' +
            'isFindById: true  && isSingleResult: true ->  (Error) -> ☠️\n' +
            '');
    }
};
const generateModelRouteMap = (model) => {

    const route = MODEL_TO_ROUTE[model];
    if (!route) {
        throw new Error(`Model '${model}' doesn't have an assigned route.`);
    }
    const idName = `${route}${PARAMS_POSTFIX_ID}`;
    const path = `${route}/{${idName}}`;
    return {
        model,
        route,
        idName,
        path
    };
};

module.exports = ({ models, isFindById = false, isSingleResult = false }) => {

    validateConfiguration({ models, isFindById, isSingleResult });
    const modelRouteMap = _(models).map(generateModelRouteMap).value();
    const path = _(modelRouteMap).initial().map('path').value();
    if (isFindById) {
        path.push(_(modelRouteMap).last().path); // /{model}/{modelId}
    }
    else {
        path.push(_(modelRouteMap).last().route); // /{model}
    }

    return {
        method: 'get',
        path: `/${path.join('/')}`,
        options: {
            tags: ['api'],
            validate: {

                query: (() => {

                    if (!isFindById && !isSingleResult) {
                        return GlobalValidator.findAll.query;
                    }
                    return null;
                })(),
                params: (() => {

                    const validation = {};
                    const filteredMap = isFindById ? _(modelRouteMap) : _(modelRouteMap).initial();
                    filteredMap.each(
                        (modeRoute) => {

                            validation[modeRoute.idName] = Joi.string().required().description(`${modeRoute.model} id`);
                        }
                    );

                    return validation;
                })()
            },

            handler: async (request) => {

                const { globalService } = await request.services();
                const getParametersFromRequest = (modeRoute) => {

                    const { model, idName } = modeRoute;
                    const id = request.params[idName];
                    return { model, id };
                };
                const { skip, limit, direction, field, filter } = request.query;
                const modelPath = _(modelRouteMap).map(getParametersFromRequest).value();

                try {
                    return await globalService.findInModelPath({ modelPath, isFindById, isSingleResult, skip, limit, direction, field, filter });
                }
                catch ({ message, statusCode }) {

                    return new Boom(message, { statusCode });
                }
            }
        }
    };
};
