const mongoose = require("mongoose")
const { Schema } = mongoose;

const user_info = new Schema({
    username:  String,
    password: String,
    userid:   String,
	key: Buffer,
	iv: Buffer
    },
	{ collection : 'users' });

const user_data = new Schema({
		userid: String,
		title:  String,
		content: String
	},
	{ collection : 'userdata' });

const Note = mongoose.model('userdata', user_data);
const User = mongoose.model('users', user_info);



module.exports = { User, Note}
