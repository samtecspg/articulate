import _ from 'lodash';
import RichResponses from '../../rich-responses';

module.exports = async function () {

    return _.mapValues(RichResponses, 'info')
};
