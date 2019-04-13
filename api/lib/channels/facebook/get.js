import Crypto from 'crypto';

module.exports = async function ({ connection, request }) {

  const data = request.query;

  const {
    verifyToken
  } = connection.details

  const mode = data['hub.mode'],
     token = data['hub.verify_token'],
     challenge = data['hub.challenge']

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === verifyToken) {
      
      // TODO: Update model status
      return challenge
      //   })
    }
  }
}