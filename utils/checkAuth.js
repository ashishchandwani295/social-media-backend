const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.checkAuth = ( context ) => {

    const authHeader = context.req.headers.authorization;

    if(authHeader) {

        const token = authHeader.split('Bearer ')[1];

        if(token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        
        throw new Error('Authentication token should be \'Bearer [token]\'');

    } else {
        throw new Error('Authorization header not provided');
    }
}