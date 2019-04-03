import Crypto from 'crypto';

module.exports = async function ({ event }) {
    
    const secret = {
        userId: event['conversation']['conversationId']
    }
    const hash = Crypto.createHmac('sha256', JSON.stringify(secret)).digest('hex');;

    return hash

}