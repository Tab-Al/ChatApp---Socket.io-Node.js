'use strict';

const routingHelpers = require('./routing_module_helper');
const passport = require('passport');
const config = require('../config/env_loader');

module.exports = function(){

	let routes = {

		'GET'	: {

			'/': (req,res,next)=>{
				if(!req.user)
				{
					res.render('login');	
				}
				else
				{
					res.render('rooms', { host: config.host });
				}
			},

			'/logout' : (req,res,next)=>{
				req.user = null;
				req.logout();
				req.flash('success','You are logged out');
				console.log('User Logged Out');
				res.redirect('/');
			},

			'/rooms': [routingHelpers.isAuth.ensureAuthenticated, (req,res,next)=>{
				res.render('rooms', { host: config.host });
			}],

			'/chat/:roomid': [routingHelpers.isAuth.ensureAuthenticated, (req,res,next)=>{
				
				//find room by room id, if present then render it 
				let getRoom = routingHelpers.findRoomById(req.app.locals.chatrooms, req.params.roomid);
				if(getRoom === undefined)
				{
					return next();
				}
				else
				{
					res.render('chatroom', { host: config.host , roomName: getRoom.room , roomID : getRoom.roomID });
				}
			}],

			'/auth/facebook' : passport.authenticate('facebook',{scope:'email'}),

			'/auth/facebook/callback': passport.authenticate('facebook',{ successRedirect: '/rooms', failureRedirect: '/'})
		},

		'POST'	: {

		},

		'NA'	: (req,res,next)=>{
			res.status(404).sendFile(process.cwd() + '/views/404.html');
		}
	}

	return routingHelpers.recurseThroughRoutes(routes);
} 