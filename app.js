const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const methodOverride = require("method-override");
const connectDB = require("./DB/db");
const flash = require("connect-flash");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionConfig = {
	secret: "yelpCamp",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
	new LocalStrategy({ usernameField: "email" }, User.authenticate())
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// home page
app.get("/", (req, res) => {
	res.render("home");
});

app.use((req, res, next) => {
	// console.log(req.session);
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
// app.get("/fake", async (req, res) => {
// 	const user = await new User({
// 		email: "alpesh@gmail.com",
// 		username: "alpesh",
// 	});
// 	const newUser = await User.register(user, "alpesh");
// 	res.send({ user, newUser });
// });

app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
	// console.log(err);
	const { status = 500, message = "Something went wrong", stack = "" } = err;
	res.status(status).render("error", { message, stack });
});

// connection function
connectDB();

app.listen(3000, () => {
	console.log("-----------------------------");
	console.log("Server Started at port 3000.".yellow.bold);
	console.log("-----------------------------");
});
