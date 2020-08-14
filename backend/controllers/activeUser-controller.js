const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const ActiveUser = require('../models/activeUsers');
const mongoose = require('mongoose');

exports.index = async (req, res, next) => {
	const { clientId } = req.params;
	console.log(req.params);

	let activeUsers;
	try {
		console.log(clientId);
		activeUsers = await ActiveUser.find({ clientId: clientId });
		if (!activeUsers) {
			return res.status(200).send('Not able to find any user');
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Could not find any user!', 500);
		return next(error);
	}

	res.status(200).json(activeUsers);
};

exports.create = async (req, res, next) => {
	const {
		name,
		email,
		password,
		teamviewer,
		tvpassword,
		phone,
		login,
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

	const createdActiveUser = new ActiveUser({
		name,
		email,
		password,
		teamviewer,
		tvpassword,
		phone,
		login,
		clientId,
	});

	try {
		await createdActiveUser.save();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create user failed (save)', 500);
		return next(error);
	}

	return res.status(200).json(createdActiveUser);
};

exports.update = async (req, res, next) => {
	const { activeUserId } = req.params;

	const {
		email,
		name,
		password,
		teamviewer,
		tvpassword,
		phone,
		login,
	} = req.body;

	const updatedActiveUser = {
		email: email,
		name: name,
		password: password,
		teamviewer: teamviewer,
		tvpassword: tvpassword,
		phone: phone,
		login: login,
		updated_at: Date.now(),
	};

	let activeUser;

	try {
		activeUser = await ActiveUser.findOneAndUpdate(
			{ _id: activeUserId },
			updatedActiveUser,
		);
	} catch (err) {
		const error = new HttpError('User already exists or DB error', 500);
		return next(error);
	}

	if (!activeUser) {
		const error = new HttpError(
			'Could not find any user for the provided ID',
			404,
		);
		return next(error);
	}

	res.status(200).json({ message: 'activeUser updated!' });
};

exports.delete = async (req, res, next) => {
	const { activeUserId } = req.params;

	let activeUser;

	try {
		activeUser = await ActiveUser.findById({ _id: activeUserId });
	} catch (err) {
		const error = new HttpError('Error to find the user', 500);
		return next(error);
	}

	if (!activeUser) {
		const error = new HttpError(
			'Could not find any user for the provided id',
			404,
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await activeUser.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError('Error deleting the user, DB session', 500);
		return next(error);
	}

	res.status(200).json({ message: 'activeUser deleted!' });
};
