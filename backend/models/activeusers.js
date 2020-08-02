const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const activeusersSchema = new Schema({
	name: { type: String, required: true },
	teamviewer: { type: String, required: true },
	typassword: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	login: { type: String, required: true },
	client: { type: String, required: true },
	created_at: { type: String, required: true },
	updated_at: { type: String, required: true },
});

activeusersSchema.plugin(uniqueValidator);

activeusersSchema.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('ActiveUsers', activeusersSchema);
