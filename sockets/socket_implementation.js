'use strict';

const socketFunctions = require('./socket_functions');

module.exports = (io, app)=>{

	//array that contains all existing chatrooms
	let allrooms = app.locals.chatrooms;

	io.of('/roomslist').on('connection', function(socket){
		
		socket.on('getChatrooms', ()=>{
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		});

		socket.on('createNewChatroom', (newRoomName)=>{

			// find chatroom by name
			if(!socketFunctions.findRoomByName(allrooms, newRoomName))
			{
				// create new chatroom
				socketFunctions.pushToChatrooms(allrooms, newRoomName);
			
				// emit updated chatroom list to creator
				socket.emit('chatRoomsList', JSON.stringify(allrooms));
				
				// emit updated chatroom list to everyone connected
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
			} 
			else
			{
				console.log('Chatroom named : ' + newRoomName + ' already exists');
			}
		});
	});

	io.of('/chatter').on('connection', function(socket){

		// join chatroom
		socket.on('join', function(data){

			// add user to room and return complete room info (roomID, roomname, users array)
			let roomInfo = socketFunctions.addUserToRoom(allrooms, data, socket);

			// update list of users for every users
			socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(roomInfo.users));
			// broadcast.to doesnt update for current user, hence to it separately
			socket.emit('updateUsersList', JSON.stringify(roomInfo.users));
		});

		//when user leaves room
		socket.on('disconnect', function()
		{
			// Find the room, and remove user
			let roomInfo = socketFunctions.removeUserFromRoom(allrooms, socket);

			socket.broadcast.to(roomInfo.roomID).emit('updateUsersList', JSON.stringify(roomInfo.users));			
		});

		// when new msg arrives
		socket.on('newMsg', function(data){
			//console.log('User entered new message');
			socket.broadcast.to(data.roomID).emit('displayMsg', JSON.stringify(data));
		});
	});
}