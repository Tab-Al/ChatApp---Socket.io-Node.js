'use strict';

const db = require('../config/env_loader').MongoURI;
const mongoose = require('mongoose');

mongoose.connect(db);

mongoose.connection.on('error', (error)=>{
	console.log("Mongo Error : ", error);
});

mongoose.connection.once('open', ()=>{
	console.log("Connected to MongoDB");
});

module.exports = { mongoose }