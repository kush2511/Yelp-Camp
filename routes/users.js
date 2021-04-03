const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res, next) => {
		try {
			const { username, email, password } = req.body;
			const findEmail = await User.findOne({ email });
			const findUsername = await User.findOne({ username });
			if (!findEmail || !findUsername) {
				const user = new User({ email, username });
				const registeredUser = await User.register(user, password);
				//	console.log(registeredUser);
				req.login(registeredUser, (err) => {
					if (err) {
						return next(err);
					}
					req.flash(
						"success",
						`Welcome ${registeredUser.username} To Yelp Camp`
					);
					res.redirect("/campgrounds");
				});
			} else {
				req.flash(
					"error",
					"A User with the given email/username is already registered!"
				);
				res.redirect("/register");
			}
		} catch (e) {
			req.flash("error", e.message);
			res.redirect("/register");
		}
	})
);

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	(req, res) => {
		// console.log(req.user);
		req.flash("success", `Welcome Back ${req.user.username}!`);
		const redirectUrl = req.session.returnTo || "/campgrounds";
		delete req.session.returnTo;
		res.redirect(redirectUrl);
	}
);

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged Out Successful.");
	res.redirect("/campgrounds");
});

module.exports = router;
