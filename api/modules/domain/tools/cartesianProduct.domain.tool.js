'use strict';

const _ = require('lodash');

const cartesianProductOf = (keywordsList) => {

    return _.reduce(keywordsList, (a, b) => {

        return _.flatten(_.map(a, (x) => {

            return _.map(b, (y) => {

                return x.concat([y]);
            });
        }), true);
    }, [[]]);
};

module.exports = cartesianProductOf;
