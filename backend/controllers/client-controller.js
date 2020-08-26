const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EmailsUser = require('../models/clientEmailsUser');
const EnterpriseAsset = require('../models/enterpriseAsset');
const HttpError = require('../models/http-error');
const Equipment = require('../models/equipments');
const License = require('../models/license');
const mongoose = require('mongoose');

exports.index = async (req, res, next) => {
	const { clientId } = req.params;
	try {
		const clientInfo = await User.findById({ _id: clientId }, '-password');
		if (clientInfo) {
			return res.status(200).json(clientInfo);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find user', 500);
		return next(error);
	}

	return res.status(404).json('Could not find any user!');
};

exports.indexEmails = async (req, res, next) => {
	try {
		const allAccounts = await EmailsUser.find();

		return res.status(200).json(allAccounts);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find the emails', 500);
		return next(error);
	}
};

exports.activeEmailAccount = async (req, res, next) => {
	const { clientId } = req.params;

	try {
		const clientExists = await User.findById({ _id: clientId }, '-password');
		if (!clientExists) {
			return res.status(404).json('User not exist');
		}

		const accounts = await EmailsUser.find({ clientId: clientId });

		return res.status(200).json(accounts);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find user', 500);
		return next(error);
	}
};

exports.editEmailAccount = async (req, res, next) => {
	const { accountId } = req.params;
	const { name, email, license } = req.body;

	const updatedEmailAccount = {
		name: name,
		email: email,
		license: license,
		updated_at: Date.now(),
	};

	let account;

	try {
		account = await EmailsUser.findOneAndUpdate(
			{ _id: accountId },
			updatedEmailAccount,
		);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to edit the email account', 500);
		return next(error);
	}

	if (!account) {
		const error = new HttpError(
			'Could not find account for the provided ID',
			404,
		);
		return next(error);
	}

	res.status(200).json({ message: 'Email account updated!' });
};

exports.deleteEmailAccount = async (req, res, next) => {
	const { accountId } = req.params;

	let account;

	try {
		account = await EmailsUser.findById({ _id: accountId });

		if (!account) {
			const error = new HttpError(
				'Could not find account for the provided id',
				404,
			);
			return next(error);
		}
	} catch (err) {
		const error = new HttpError('Error trying to find the account', 500);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await account.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError('Error deleting the email, DB session', 500);
		return next(error);
	}

	res.status(200).json({ message: 'Email deleted!' });
};

exports.activeUsers = async (req, res, next) => {};

exports.indexAssets = async (req, res, next) => {
	try {
		const assets = await EnterpriseAsset.find();

		return res.status(200).json(assets);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find the assets', 500);
		return next(error);
	}
};

exports.getAsset = async (req, res, next) => {
	const { clientId } = req.params;

	try {
		const clientExists = await User.findById({ _id: clientId }, '-password');
		if (!clientExists) {
			return res.status(404).json('User not exist');
		}

		const assets = await EnterpriseAsset.find({ clientId: clientId });

		return res.status(200).json(assets);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find the assets', 500);
		return next(error);
	}
};

exports.createAsset = async (req, res, next) => {
	const {
		equipment,
		modelo,
		hostname,
		user,
		memory,
		cpu,
		hd,
		so,
		licensed,
		antivirus,
		tdr,
		inuse,
		clientId,
	} = req.body;

	try {
		const checkUser = await User.findOne({ _id: clientId });
		if (!checkUser) {
			const error = new HttpError('User not exists', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user check DB');
		return next(error);
	}

	const createdAsset = new EnterpriseAsset({
		equipment,
		modelo,
		hostname,
		user,
		memory,
		cpu,
		hd,
		so,
		licensed,
		antivirus,
		tdr,
		inuse,
		clientId,
	});

	try {
		await createdAsset.save();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create asset failed (save)', 500);
		return next(error);
	}

	return res.status(200).json(createdAsset);
};

exports.deleteAsset = async (req, res, next) => {
	const { assetId } = req.params;

	let asset;

	try {
		asset = await EnterpriseAsset.findById({ _id: assetId });

		if (!asset) {
			const error = new HttpError(
				'Could not find any asset for the provided id',
				404,
			);
			return next(error);
		}
	} catch (err) {
		const error = new HttpError('Error trying to find the asset', 500);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await asset.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError('Error deleting the asset, DB session', 500);
		return next(error);
	}

	res.status(200).json({ message: 'Asset deleted!' });
};

exports.editAsset = async (req, res, next) => {
	const { assetId } = req.params;
	const {
		equipment,
		modelo,
		hostname,
		user,
		memory,
		cpu,
		hd,
		so,
		licensed,
		antivirus,
		tdr,
		inuse,
	} = req.body;

	const updatedAsset = {
		equipment,
		modelo,
		hostname,
		user,
		memory,
		cpu,
		hd,
		so,
		licensed,
		antivirus,
		tdr,
		inuse,
		updated_at: Date.now(),
	};

	try {
		const asset = await EnterpriseAsset.findOneAndUpdate(
			{ _id: assetId },
			updatedAsset,
		);

		if (!asset) {
			const error = new HttpError(
				'Could not find the asset for the provided ID',
				404,
			);
			return next(error);
		}

		res.status(200).json({ message: 'Asset updated!' });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to edit the email account', 500);
		return next(error);
	}
};

exports.createEmails = async (req, res, next) => {
	const { clientId, email, name, license } = req.body;

	try {
		const checkUser = await User.findOne({ _id: clientId });
		if (!checkUser) {
			const error = new HttpError('User not exists', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user check DB');
		return next(error);
	}

	const createdEmailUser = new EmailsUser({
		name,
		email,
		license,
		clientId,
	});

	try {
		await createdEmailUser.save();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create user failed (save)', 500);
		return next(error);
	}

	return res.status(200).json(createdEmailUser);
};

exports.indexEquipments = async (req, res, next) => {
	try {
		const allEquips = await Equipment.find();

		return res.status(200).json(allEquips);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find the equipments', 500);
		return next(error);
	}
};

exports.getEquipments = async (req, res, next) => {
	const { clientId } = req.params;

	try {
		const clientExists = await User.findById({ _id: clientId }, '-password');
		if (!clientExists) {
			return res.status(404).json('User not exist');
		}

		const equips = await Equipment.find({ clientId: clientId });

		return res.status(200).json(equips);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find the equipments', 500);
		return next(error);
	}
};

exports.createEquipment = async (req, res, next) => {
	const { clientId, equipment, version, type, due_date, modalidade } = req.body;

	try {
		const checkUser = await User.findOne({ _id: clientId });
		if (!checkUser) {
			const error = new HttpError('User(client) not exists', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user(client) check DB');
		return next(error);
	}

	const createdEquip = new Equipment({
		clientId,
		equipment,
		version,
		type,
		due_date,
		modalidade,
	});

	try {
		await createdEquip.save();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create equipment failed (save)', 500);
		return next(error);
	}

	return res.status(200).json(createdEquip);
};

exports.editEquipment = async (req, res, next) => {
	const { equipmentId } = req.params;
	const { equipment, version, type, due_date, modalidade } = req.body;

	const updatedEquipment = {
		equipment,
		version,
		type,
		due_date,
		modalidade,
		updated_at: Date.now(),
	};

	try {
		const equip = await Equipment.findOneAndUpdate(
			{ _id: equipmentId },
			updatedEquipment,
		);

		if (!equip) {
			const error = new HttpError(
				'Could not find the equipent for the provided ID',
				404,
			);
			return next(error);
		}

		res.status(200).json({ message: 'Equipment updated!' });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to edit the Equipment', 500);
		return next(error);
	}
};

exports.deleteEquipment = async (req, res, next) => {
	const { equipmentId } = req.params;

	let equip;

	try {
		equip = await Equipment.findById({ _id: equipmentId });

		if (!equip) {
			const error = new HttpError(
				'Could not find any equipment for the provided id',
				404,
			);
			return next(error);
		}
	} catch (err) {
		const error = new HttpError('Error trying to find the equipment', 500);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await equip.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Error deleting the equipment, DB session',
			500,
		);
		return next(error);
	}

	res.status(200).json({ message: 'Equipment deleted!' });
};

exports.indexAllLicenses = async (req, res, next) => {
	try {
		const allLicenses = await License.find();

		return res.status(200).json(allLicenses);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find the licenses', 500);
		return next(error);
	}
};

exports.getLicenses = async (req, res, next) => {
	const { clientId } = req.params;

	try {
		const clientExists = await User.findById({ _id: clientId }, '-password');
		if (!clientExists) {
			return res.status(404).json('User not exist');
		}

		const licenses = await License.find({ clientId: clientId });

		return res.status(200).json(licenses);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to find the licenses', 500);
		return next(error);
	}
};

exports.createLicense = async (req, res, next) => {
	const {
		clientId,
		brand,
		available_licenses,
		used_licenses,
		used_equipments,
		due_date,
		provider,
		management,
	} = req.body;

	try {
		const checkUser = await User.findOne({ _id: clientId });
		if (!checkUser) {
			const error = new HttpError('User(client) not exists', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user(client) check DB');
		return next(error);
	}

	const createdLicense = new License({
		clientId,
		brand,
		available_licenses,
		used_licenses,
		used_equipments,
		due_date,
		provider,
		management,
	});

	try {
		await createdLicense.save();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create equipment failed (save)', 500);
		return next(error);
	}

	return res.status(200).json(createdLicense);
};

exports.deleteLicense = async (req, res, next) => {
	const { licenseId } = req.params;

	let license;

	try {
		license = await License.findById({ _id: licenseId });

		if (!license) {
			const error = new HttpError(
				'Could not find any license for the provided id',
				404,
			);
			return next(error);
		}
	} catch (err) {
		const error = new HttpError('Error trying to find the license', 500);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await license.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError('Error deleting the license, DB session', 500);
		return next(error);
	}

	res.status(200).json({ message: 'License deleted!' });
};

exports.editLicense = async (req, res, next) => {
	const { licenseId } = req.params;
	const {
		brand,
		available_licenses,
		used_licenses,
		used_equipments,
		due_date,
		provider,
		management,
	} = req.body;

	const updatedLicense = {
		brand,
		available_licenses,
		used_licenses,
		used_equipments,
		due_date,
		provider,
		management,
		updated_at: Date.now(),
	};

	try {
		const license = await License.findOneAndUpdate(
			{ _id: licenseId },
			updatedLicense,
		);

		if (!license) {
			const error = new HttpError(
				'Could not find the license for the provided ID',
				404,
			);
			return next(error);
		}

		res.status(200).json({ message: 'License updated!' });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error trying to edit the license', 500);
		return next(error);
	}
};
