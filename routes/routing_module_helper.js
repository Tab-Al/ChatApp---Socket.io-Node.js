'use strict';
const router = require('express').Router();

let registerRoutes = (routes,method)=>{

		for(let key in routes)
		{
			if(typeof routes[key] === 'object' && routes[key] != null && !(routes[key] instanceof Array))
			{
				registerRoutes(routes[key], key);
			}
			else
			{
				if(method === 'GET')
				{
					router.get(key, routes[key]);
				}
				else if(method === 'POST')
				{
					router.post(key, routes[key]);
				}
				else
				{
					router.use(routes[key]);
				}
			}
		}
}

let recurseThroughRoutes = (routes)=> {
	registerRoutes(routes);
	return router;
}

// to check if user is logged in or not
let isAuth = {
	ensureAuthenticated : function(req,res,next){
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'Please log in to view this resource');
		res.redirect('/');
	}
}


// to find room by id
let findRoomById = function(allrooms, roomID){
	return allrooms.find((element, index, array)=>{
		if(element.roomID === roomID)
		{
			return true;
		}
		else
		{
			return false;
		}
	});
}


module.exports = { recurseThroughRoutes , isAuth , findRoomById };