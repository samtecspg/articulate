import Crypto from 'crypto';

module.exports = async function ({ event }) {
    
    const secret = {
        user_id: event.user_id,
        channel_id: event.channel_id
    };

    const hash = Crypto.createHmac("sha256", JSON.stringify(secret)).digest("hex");
    
    return hash;

}