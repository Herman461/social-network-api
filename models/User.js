const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	status: {
		type: String,
		default: null
	},
	ava: {
		type: String,
		default: null
	},
	followers: {
		type: [Number]
	}
});

UserSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('User', UserSchema);