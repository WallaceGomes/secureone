const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		// Authorization: 'Bearer TOKEN'
		const token = req.headres.authorization.split(' ')[1];
		if (!token) {
			throw new Error('Authentication failed! auth-middleware');
		}

		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		req.userData = { userId: decodedToken.userId };
	} catch (err) {
		console.error(err);
		const error = new HttpError('Authentication failed!', 403);
		return next(error);
	}
};
