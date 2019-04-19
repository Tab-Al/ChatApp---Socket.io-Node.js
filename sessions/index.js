'use strict';

const config_env_loader = require('../config/env_loader');
const session = require('express-session');
const db = require('../db/db_main');
const MongoStore = require('connect-mongo')(session);

if(process.env.NODE_ENV === 'production')
{
	// session for production
	module.exports = session({
		secret: config_env_loader.sessionSecret,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: db.mongoose.connection
		})
	});
}
else
{
	// session for development
	module.exports = session({
		secret: config_env_loader.sessionSecret,
		resave: false,
		saveUninitialized: true
	});
}