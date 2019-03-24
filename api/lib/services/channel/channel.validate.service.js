import _ from 'lodash';
import Channels from '../../channels';

module.exports = async function ({ method, data }) {

    return Channels[data.channel].validate[method]( data.details )
};
