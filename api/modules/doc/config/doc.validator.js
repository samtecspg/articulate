'use strict';

const Joi = require('joi');

class DocValidate {
    constructor() {

        this.findById = {
            params: (() => {

                return {
                    id: Joi.number().required().description('Id of the document')
                };
            })()
        };


    }
}

const docValidate = new DocValidate();
module.exports = docValidate;
