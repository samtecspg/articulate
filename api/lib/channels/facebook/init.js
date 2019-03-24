import Crypto from 'crypto';

module.exports = async function ({ data }) {

  data.details.validationToken = Crypto.createHmac('sha256', JSON.stringify(data.agent + '-' + data.channel)).digest('hex');
  data.status = 'created'

  return data;
}