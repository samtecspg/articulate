import crypto from 'crypto';
import Schmervice from 'schmervice';

module.exports = class SecurityService extends Schmervice.Service {

    /**
     * generates random string of characters i.e salt
     * @function
     * @param {number} length - Length of the random string.
     */
    genRandomString({ length }) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
    };

    /**
     * hash password with sha512.
     * @function
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
     */
    sha512({ password, salt }) {
        const hash = crypto.createHmac('sha512', salt);
        /** Hashing algorithm sha512 */
        hash.update(password);
        const value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    };

    saltHashPassword({ password }) {
        const salt = this.genRandomString({ length: 16 });
        /** Gives us salt of length 16 */
        return this.sha512({ password, salt });
    }
};
