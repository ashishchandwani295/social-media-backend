const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.generateJWT = ( user ) => {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, {
        expiresIn: '1hr'
    });

    return token
}