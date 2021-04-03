const mongoose = require("mongoose");
module.exports = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		// console.log(conn);
		console.log(`MongoDB Connected at ${conn.connection.name}.`.cyan.bold);
		console.log("-----------------------------");
	} catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold);
		process.exit(1);
	}
};
