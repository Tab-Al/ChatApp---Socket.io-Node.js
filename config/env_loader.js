
if(process.env.NODE_ENV === 'production')
{
	module.exports = {
		host: process.env.host || "",
		MongoURI: process.env.MongoURI,
		sessionSecret: process.env.sessionSecret,
		fb: {
			clientID: process.env.fbClientID,
			clientSecret: process.env.fbClientSecret, 
			callbackURL: process.env.host + "/auth/facebook/callback",
			profileFields: ['id','displayName','photos','email']
		}
	}
}
else
{
	module.exports = require('./development.json');
}