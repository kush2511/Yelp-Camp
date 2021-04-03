const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// @review route for each campground
router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		// console.log(id);
		const campground = await Campground.findById(id);
		const review = await new Review(req.body.review);
		review.author = req.user._id;
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash("success", "Your Review Has Been Added.");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

// @delete review from each campground
router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash("error", "Your Review Has Been Deleted.");
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
