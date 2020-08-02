const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const activeUsersSchema = new Schema({
	name: { type: String, required: true },
	teamviewer: { type: String, required: true },
	tvpassword: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	login: { type: String, required: true },
	userId: { type: String, required: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

activeUsersSchema.plugin(uniqueValidator);

activeUsersSchema.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('ActiveUsers', activeUsersSchema);
