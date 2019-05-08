import _ from 'lodash';
import Categories from '../../categories';

module.exports = async function () {

    return _.mapValues(Categories, 'info');
};
