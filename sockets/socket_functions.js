
const crypto = require('crypto');
const routeHelpers = require('../routes/routing_module_helper');

let generateRoomID = function(){
		return crypto.randomBytes(24).toString('hex');
}

let pushToChatrooms = function(allrooms, newRoomName)
{
				allrooms.push({
					room: newRoomName,
					roomID: generateRoomID(),
					users: []
				});
				console.log('New Chatroom : ' + newRoomName + ' created');
}

let findRoomByName = function(allrooms, newRoomName){
	
	let findRoom = allrooms.findIndex((element, index, array)=>{
				
			if(element.room === newRoomName)
			{
				return true;
			}
			else 
			{
				return false;
			}
	});

	return findRoom > -1 ? true : false ;
}

let addUserToRoom = function(allrooms, data, socket){

	
	// find if room exists
	let getRoom = routeHelpers.findRoomById(allrooms, data.roomID);

	// if it does
	if(getRoom !== undefined)
	{
		// get user's ID
		let userID = socket.request.session.passport.user;
		
		// check if user already in room
		let checkUser = getRoom.users.findIndex( function(element, index, array){
			if(element.userID === userID)
			{
				return true;
			}
			else
			{
				return false;
			}
		});

		// if user already exists, remove him
		if(checkUser > -1)
		{
			getRoom.users.splice(checkUser, 1);
		}

		//Push user into chatroom's users
		getRoom.users.push({
			socketID: socket.id,
			userID: userID,
			userName: data.userName,
			userPic: data.profilePic
		});

		// join the room channel
		socket.join(data.roomID);
		
		console.log('User joined room : ', getRoom.room);
		return getRoom;
	}
}


let removeUserFromRoom = function(allrooms, socket){

	for(let room of allrooms){
		// find the user
		let findUser = room.users.findIndex(function(element, index, array){
			if(element.socketID === socket.id)
			{
				return true;
			}
			else
			{
				return false;
			}
		});

		if(findUser > -1 )
		{
			socket.leave(room.roomID);
			room.users.splice(findUser, 1);
			console.log('User leaves room :' , room.room)
			return room;
		}
	}
}


module.exports = { pushToChatrooms, findRoomByName, addUserToRoom , removeUserFromRoom};