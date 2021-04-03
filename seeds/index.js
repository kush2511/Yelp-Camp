const mongoose = require("mongoose");
const colors = require("colors");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const connectDB = require("./DB/db");

connectDB();

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const importData = async () => {
	try {
		await Campground.deleteMany();

		for (let i = 0; i < 10; i++) {
			const random1000 = Math.floor(Math.random() * 1000);
			const price = Math.floor(Math.random() * 10) + 10;
			const camp = new Campground({
				created: new Date().toDateString(),
				author: "6066e926a7e9a55b4068b5e6",
				location: `${cities[random1000].city}, ${cities[random1000].state}`,
				title: `${sample(descriptors)}, ${sample(places)}`,
				image: "https://source.unsplash.com/collection/483251",
				description:
					"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores aspernatur laborum reprehenderit eaque molestias ut.",
				price: price,
			});

			await camp.save();
		}

		console.log("Data Imported Successfully!".green.bold);

		process.exit();
	} catch (err) {
		console.error(`${err}`.red.bold);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Campground.deleteMany();

		console.log("Data Destroyed Successfully!".red.bold);

		process.exit();
	} catch (err) {
		console.error(`${err}`.red.bold);
		process.exit(1);
	}
};
if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
