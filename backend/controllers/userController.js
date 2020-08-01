const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const HttpError = require('../models/http-error');

exports.index = async (req, res, next) => {
	let users;
	try {
		users = await user.find({}, '-password');
	} catch (err) {
		console.error(err);
		const error = new HttpError('Could not find any user!', 500);
		return next(error);
	}

	res.status(200).json(users);
};

exports.create = async (req, res, next) => {
	const { name, email, password } = req.body;

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
		userId: user.id,
		email: user.email,
		token: token,
	});
};
