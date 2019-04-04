import _ from 'lodash';
import Channels from '../../channels';

module.exports = async function ({ data }) {

    return Channels[data.channel].init({ data })
};
