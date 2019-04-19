'use strict';

const passport = require('passport');
const strategy = require('./strategies');
const UserModel = require('../mongo_models/users_schema');


passport.use(strategy.fbs);

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id, done){
	UserModel.findById(id, function(err,user){
		done(null,user);
	});
});

module.exports = passport;
