const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// @all campgrounds
router.get(
	"/",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds, title: "All Campgrounds" });
	})
);

// @ form for new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new", { title: "Add Campground" });
});

// @submit form to add new campground
router.post(
	"/",
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground) {
		// 	throw new ExpressError("All fields Required!", 400);
		// }
		// console.log(req.body);
		const campground = new Campground(req.body.campground);
		campground.author = req.user._id;
		await campground.save();
		// console.log(campground);
		req.flash("success", `Successfully Created Campground.`);
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

// @single campground with its id
router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
			.populate({
				path: "reviews",
				populate: {
					path: "author",
				},
			})
			.populate("author");
		// console.log(campground);
		// console.log(campground.reviews);
		if (!campground) {
			req.flash("error", "Cannot find that Campground!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", { campground, title: campground.title });
	})
);

// @edit form for single campground with its id
router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash("error", "Cannot find that Campground!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { campground, title: "Edit Campground" });
	})
);

// @edit single campground with its id
router.put(
	"/:id",
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = await Campground.findByIdAndUpdate(
			req.params.id,
			{
				...req.body.campground,
			},
			{ new: true }
		);
		req.flash("success", `Successfully Updated Campground.`);
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

// @delete single campground with its id
router.delete(
	"/:id",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const campground = await Campground.findByIdAndDelete(req.params.id);
		req.flash("error", "Your Campground Has Been Deleted.");
		res.redirect("/campgrounds");
	})
);

module.exports = router;
