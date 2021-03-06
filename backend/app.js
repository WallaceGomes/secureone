const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/user-routes');
const activeUsersRoutes = require('./routes/active-user-routes');
const clientRoutes = require('./routes/client-routes');

const mongoDB = require('./mongodb/mongodb.connect');
const app = express();

mongoDB.connect();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/active', activeUsersRoutes);
app.use('/api/client', clientRoutes);
//error middleware
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}

	res.status(error.code || 500);
	res.json({
		message: error.message || 'An unknown error occurred! (api routes) ',
	});
});

module.exports = app;
