const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EmailsUser = require('../models/clientEmailsUser');
const EnterpriseAsset = require('../models/enterpriseAsset');
const HttpError = require('../models/http-error');
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

exports.equips = async (req, res, next) => {};

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

exports.getAssets = async (req, res, next) => {
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

exports.createAssets = async (req, res, next) => {
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

	console.log(createdAsset);

	try {
		await createdAsset.save();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create asset failed (save)', 500);
		return next(error);
	}

	return res.status(200).json(createdAsset);
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
