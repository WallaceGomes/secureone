const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sda9s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			},
		);
		console.log('DB Connected!');
	} catch (err) {
		console.error('Connection error with DB');
		console.error(err);
	}
}

module.exports = { connect };
