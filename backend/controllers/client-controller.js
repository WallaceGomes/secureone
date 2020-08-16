const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

exports.index = async (req, res, next) => {
	let users;
	try {
		users = await User.find({ role: 'client' }, '-password');
	} catch (err) {
		console.error(err);
		const error = new HttpError('Could not find any user!', 500);
		return next(error);
	}

	res.status(200).json(users);
};

exports.create = async (req, res, next) => {
	const {
		name,
		email,
		password = process.env.DEFAULT_PASS,
		role = 'client',
		confirmed = false,
		address,
		cnpj,
		status,
		contract,
		due_date,
	} = req.body;

	try {
		const checkUser = await User.findOne({ email: email });
		if (checkUser) {
			const error = new HttpError('User already exists', 422);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Connection error, user check DB');
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		console.error(err);
		const error = new HttpError(
			'Could not create user, try again later.(hash error)',
			500,
		);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		password: hashedPassword,
		confirmed,
		role,
		address,
		cnpj,
		status,
		contract,
		due_date,
	});

	try {
		await createdUser.save();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create user failed (save)', 500);
		return next(error);
	}

	createdUser.password = undefined;

	return res.status(200).json(createdUser);
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	let user;
	try {
		user = await User.findOne({ email: email });
		if (!user) {
			const error = new HttpError('Login failed, invalid credentials', 403);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError(
			'Login failed, unable to reach the server',
			500,
		);
		return next(error);
	}

	try {
		let isValidPass = false;
		isValidPass = await bcrypt.compare(password, user.password);

		if (!isValidPass) {
			const error = new HttpError('Login failed, invalid credentials', 401);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Bcrypt function error', 500);
		return next(error);
	}

	if (user.confirmed) {
		let token;
		try {
			token = jwt.sign(
				{ userId: user.id, email: user.email },
				process.env.JWT_KEY,
				{ expiresIn: '12h' },
			);
		} catch (err) {
			const error = new HttpError('Login failed, JWT', 500);
			return next(error);
		}

		return res.status(201).json({
			userName: user.name,
			role: user.role,
			userId: user.id,
			email: user.email,
			token: token,
		});
	} else {
		return res.status(200).send(false);
	}
};

exports.changePassword = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Unable to find the user', 500);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		console.error(err);
		const error = new HttpError(
			'Could not create user, try again later.(hash error)',
			500,
		);
		return next(error);
	}

	const updatedUser = {
		password: hashedPassword,
		updated_at: Date.now(),
		confirmed: true,
	};

	try {
		await User.findOneAndUpdate({ email: email }, updatedUser);
	} catch (err) {
		const error = new HttpError('Unexpected error', 500);
		console.log(err);
		return next(error);
	}

	res.status(200).json({ message: 'Your password has been changed!' });
};

exports.update = async (req, res, next) => {
	const { userId } = req.params;
	const { email, name, address, cnpj, status, contract, due_date } = req.body;

	const updatedUser = {
		email: email,
		name: name,
		address: address,
		cnpj: cnpj,
		status: status,
		contract: contract,
		due_date: due_date,
		updated_at: Date.now(),
	};

	let user;

	try {
		user = await User.findOneAndUpdate({ _id: userId }, updatedUser);
	} catch (err) {
		const error = new HttpError('User already exists or DB error', 500);
		return next(error);
	}

	if (!user) {
		const error = new HttpError(
			'Could not find any user for the provided ID',
			404,
		);
		return next(error);
	}

	res.status(200).json({ message: 'User updated!' });
};

exports.delete = async (req, res, next) => {
	const { userId } = req.params;

	let user;

	try {
		user = await User.findById({ _id: userId });
	} catch (err) {
		const error = new HttpError('Error to find the user', 500);
		return next(error);
	}

	if (!user) {
		const error = new HttpError(
			'Could not find any user for the provided id',
			404,
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await user.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.error(err);
		const error = new HttpError('Error deleting the user, DB session', 500);
		return next(error);
	}

	res.status(200).json({ message: 'User deleted!' });
};
