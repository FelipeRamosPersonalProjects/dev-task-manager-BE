const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

class AuthService {
    constructor(setup) {
        const { parent } = Object(setup);

        this._parentBucket = () => parent;
    }

    get parentBucket() {
        return this._parentBucket && this._parentBucket();
    }

    get secretKey() {
        return process.env.API_SECRET;
    }

    async signIn(password) {
        try {
            const isValid = await this.validateCredentials(password);
            
            if(!isValid) {
                return new Error.Log('auth.invalid_credentials');
            }

            return isValid.toSuccess('User is valid!');
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async genSalt(length) {
        try {
            const salt = await bcrypt.genSalt(length || 8);
            return salt;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createHash(password, saltLength) {
        try {
            const salt = await this.genSalt(saltLength);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    createToken() {
        try {
            const userName = this.getSafe('parentBucket.userName');
            const password = this.getSafe('parentBucket.password');
            const token = JWT.sign({userName, password}, this.secretKey)
            return token;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async validateToken() {
        try {
            
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async validateCredentials(password) {
        try {
            const isMatch = await bcrypt.compare(password, this.parentBucket.password);
            return isMatch;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = AuthService;
