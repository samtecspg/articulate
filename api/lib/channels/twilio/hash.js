import Crypto from 'crypto';

module.exports = async function ({ event }) {

  var secret = {
    phoneNumber: event['From']
  }
  var hash = Crypto.createHmac('sha256', JSON.stringify(secret)).digest('hex');;
  
  return hash;
}