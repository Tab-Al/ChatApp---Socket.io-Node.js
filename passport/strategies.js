const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config/env_loader');
const UserModel = require('../mongo_models/users_schema');

let fbs = new FacebookStrategy(config.fb, (accessToken, refreshToken, profile, done)=>{

	//console.log('Profile found ' + profile.displayName);
	UserModel.findOne({ profileId: profile.id })
		.then(result => {
			if(result)
			{
				console.log('FB Login : User Found');
				//console.log(profile);
				done(null, result);
			}
			else
			{
				console.log('FB Login : New User');
				let newUser = new UserModel({
					profileId: profile.id,
					fullName: profile.displayName,
					profilePic: profile.photos[0].value || '',
					email : profile.emails[0].value,
					provider: 'facebook'
				});
				
				newUser.save()
					.then( user=> {
						console.log('New FB user registered.');
						done(null,user);
					})
					.catch(err => console.log(err));	
			}
		});		
});

module.exports = { fbs };