const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
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

exports.activeAccounts = async (req, res, next) => {};

exports.activeUsers = async (req, res, next) => {};

exports.equips = async (req, res, next) => {};

exports.assets = async (req, res, next) => {};
