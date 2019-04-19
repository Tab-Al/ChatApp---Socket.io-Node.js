const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	
	profileId: {
		type: String
	},
	fullName: {
		type: String,
		required: true
	},
	profilePic: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String
	},
	provider: {
		type: String,
		required: true,
		default: 'local'
	}
	
});

const User = mongoose.model('User',UserSchema,'users');

module.exports = User;