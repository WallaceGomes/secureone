const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	confirmed: { type: Boolean, required: true },
	role: { type: String },
	address: { type: String },
	cnpj: { type: String },
	status: { type: Boolean },
	contract: { type: String },
	due_date: { type: Date },
	created_at: { type: Date },
	updated_at: { type: Date },
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('User', userSchema);
