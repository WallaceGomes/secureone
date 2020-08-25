const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const equipment = new Schema({
	equipment: { type: String, required: true },
	version: { type: String, required: true },
	type: { type: String, required: true },
	due_date: { type: String, required: true },
	modalidade: { type: String, required: true },
	clientId: { type: String, required: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

equipment.plugin(uniqueValidator);

equipment.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('Equipment', equipment);
