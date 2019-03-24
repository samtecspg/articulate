import _ from 'lodash';
import Channels from '../../channels';

module.exports = async function () {

    return _.mapValues(Channels, 'info')
};
