const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('User', userSchema);
