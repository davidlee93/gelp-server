'use strict';
const {authRouter} = require('./auth.router');
const {userRouter} = require('./user.router');
const {ratingRouter} = require('./rating.router');
const {localStrategy, jwtStrategy} = require('./strategies');

module.exports = {authRouter, userRouter, localStrategy, jwtStrategy, ratingRouter};