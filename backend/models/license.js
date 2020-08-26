const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const license = new Schema({
	brand: { type: String, required: true },
	available_licenses: { type: Number, required: true },
	used_licenses: { type: Number, required: true },
	used_equipments: { type: Number, required: true },
	due_date: { type: String, required: true },
	provider: { type: String, required: true },
	management: { type: String, required: true },
	clientId: { type: String, required: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

license.plugin(uniqueValidator);

license.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('License', license);
