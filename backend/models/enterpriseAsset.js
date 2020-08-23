const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const enterpriseAsset = new Schema({
	equipment: { type: String, required: true },
	modelo: { type: String, required: true },
	hostname: { type: String, required: true, unique: true },
	user: { type: String, required: true },
	memory: { type: String, required: true },
	cpu: { type: String, required: true },
	hd: { type: String, required: true },
	so: { type: String, required: true },
	licensed: { type: String, required: true },
	antivirus: { type: String, required: true },
	tdr: { type: String, required: true },
	inuse: { type: String, required: true },
	clientId: { type: String, required: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

enterpriseAsset.plugin(uniqueValidator);

enterpriseAsset.pre('save', function (next) {
	this.created_at = Date.now();
	next();
});

module.exports = mongoose.model('EnterpriseAsset', enterpriseAsset);
