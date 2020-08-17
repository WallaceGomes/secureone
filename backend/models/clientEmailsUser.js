const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const clientEmailsUser = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	license: { type: String, required: true },
	clientId: { type: String, required: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

clientEmailsUser.plugin(uniqueValidator);

clientEmailsUser.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('EmailsUser', clientEmailsUser);
