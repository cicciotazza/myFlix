/**
 * @file This file implements two passport strategies that are used to authenticate requests to the 
 * Api endpoints. The local strategy is used when a user logs in, and validates the username and 
 * password against the users collection in the database. For subsequent requests the JWT strategy is 
 * used. This validates the request by decoding the Json Web Token returned to the user on a successful 
 * login, then checking the user ID from the payload against the users collection in the database.
 
 * @requires passport Used to create strategies for authenticating and authorising requests to the Api endpoints.
 * @requires passport-local Used to create a local strategy.
 * @requires passport-jwt Used to create a jwt strategy and to extract tokens from requests.
 * @requires './models.js' The file where data schemas and models are defined.
 */

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');
const bcrypt = require("bcrypt");

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/** Configures and registers a local authentication strategy */
passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
},
    // Verify callback takes username, password and invokes done where credentials are valid
    (username, password, callback) => {
        console.log(username + '  ' + password);
        Users.findOne({ userName: username }, (error, user) => {
            if (error) {
                console.log(error);
                return callback(error);
            }

            if (!user) {
                console.log('incorrect username');
                return callback(null, false, { message: 'Incorrect username or password.' });
            }
            //added with 2.10 for password validation                                                
            if (!user.validatePassword(password)) {
                console.log('incorrect password');
                return callback(null, false, { message: 'Incorrect password.' });
            }

            console.log('finished');
            return callback(null, user);
        });
    }));

/** Configures and registers a local authentication strategy */
passport.use(new JWTStrategy({
    // Options object must contain the function to return the JWT and the secret to decode it
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
},
    //Verify callback takes decoded JWT payload and invokes done where userID valid
    (jwtPayload, callback) => {
        return Users.findById(jwtPayload._id)
            .then((user) => {
                return callback(null, user);
            })
            .catch((error) => {
                return callback(error)
            });
    }));