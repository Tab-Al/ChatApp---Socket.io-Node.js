'use strict';
console.log('ChatApp by Tab_Al');

// get required modules
const express = require('express');
const app = express();
var passport = require('./passport/passport');
var flash = require('connect-flash');

// set up template engine
app.set('view engine', 'ejs');


// session
app.use(require('./sessions'));


// Connect flash messages
app.use(flash());

// public files
app.use(express.static('./assets'));


// Passport
app.use(passport.initialize());
app.use(passport.session());


// define global variables
app.use( (req,res,next)=>{
	res.locals.user = req.user || null;
	res.locals.session = req.session || null;
	res.locals.error_msg = req.flash('error_msg');
	res.locals.success_msg = req.flash('error_msg');
	next();
});


// use routers
app.use('/', require('./routes/index')());


// create IO server instance
let IOserver = function(){

	app.locals.chatrooms = [];
	const http_server = require('http').Server(app);
	const io = require('socket.io')(http_server);
	io.use((socket, next)=>{
		require('./sessions/index')(socket.request, {}, next);
	});
	require('./sockets/socket_implementation')(io, app);
	return http_server;
}


// set up Port
const PORT = process.env.PORT || 5000;
IOserver().listen(PORT, console.log('Server started on Port : ' + PORT));