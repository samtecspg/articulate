import _ from 'lodash';

const cartesianProductOf = async function (entitiesList) {

    return await _.reduce(entitiesList, (a, b) => {

        return _.flatten(_.map(a, (x) => {

            return _.map(b, (y) => {

                return x.concat([y]);
            });
        }), true);
    }, [[]]);
};

module.exports = cartesianProductOf;
