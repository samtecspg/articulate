import Crypto from 'crypto';

module.exports = async function ({ event }) {
    
    const secret = {
        session_id: event.sessionId
    };

    const hash = Crypto.createHmac("sha256", JSON.stringify(secret)).digest("hex");
    
    return hash;

}