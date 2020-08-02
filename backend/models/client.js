const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const clientSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	address: { type: String, required: true },
	cnpj: { type: String, required: true },
	status: { type: Boolean, required: true },
	contract: { type: String, required: true },
	due_date: { type: Date, required: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

clientSchema.plugin(uniqueValidator);

clientSchema.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('Client', clientSchema);
