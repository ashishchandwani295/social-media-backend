const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { validateUserInputs, validateUserLogin } = require('../../utils/validators');
const { generateJWT } = require('../../utils/generateJWT');

module.exports = {
    Mutation: {
        // Four arguments in general:
        // 1. parent: used in case when a resolver calls another resolver
        // 2. args: mostly used. args represent the input that we receive from the user
        // 3. context: it consists of the req body, used to access the authorization token
        // 4. info: contains metadata
        async register(_, { registerInput: { 
            email, 
            username, 
            password, 
            confirmPassword
        }}) {

            //validate user data
            const { errors, valid } = validateUserInputs(email, username, password, confirmPassword);

            if(!valid) {
                throw new UserInputError("Error", {
                    errors : {
                        message: errors
                    }
                })
            }
            //check if user already exists
            try{
                const user = await User.findOne({ username })
                if(user) {
                    throw new UserInputError("Username taken already", {
                        errors: {
                            username: "Username not available"
                        }
                    })
                }
            } catch(err) {
                throw new Error(err)
            }
            //hash password and create a token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                password,
                username,
                createdAt: new Date().toISOString()
            })

            try {
                const result = await newUser.save();

                const token = generateJWT(result);

                return {
                    ...result._doc,
                    id: result._id,
                    token: token
                }

            } catch (err) {
                throw new Error(err)
            }

        },

        //login mutation to enbale user login
        async login(_, { loginInput : {
            username, password
        }}) {

            //validate login data
            const { errors, valid } = validateUserLogin(username, password);

            if(!valid) {
                throw new UserInputError('Error', {
                    errors: errors
                })
            }
                const user = await User.findOne({ username });

                if(!user) {
                    errors.general = 'User not found';
                    throw new UserInputError('User not found', {
                        errors: errors
                    })
                }

                //decrypt password from db and compare it with user input password
                const match = await bcrypt.compare(password, user.password);

                if(!match) {
                    errors.general = 'Wrong Credentials';
                    throw new UserInputError('Wrong Credentails', {
                        errors: errors
                    })
                }

                const token = generateJWT(user);

                return {
                    ...user._doc,
                    id: user._id,
                    token
                }
        }
    }
}