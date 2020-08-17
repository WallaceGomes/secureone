const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EmailsUser = require('../models/clientEmailsUser');
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

exports.activeAccounts = async (req, res, next) => {
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

exports.activeUsers = async (req, res, next) => {};

exports.equips = async (req, res, next) => {};

exports.assets = async (req, res, next) => {};

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
