import _ from 'lodash';

module.exports = ({ list }) =>

    _.reduce(list, (a, b) =>

        _.flatten(_.map(a, (x) =>

            _.map(b, (y) =>

                x.concat([y]))), true), [[]]);
