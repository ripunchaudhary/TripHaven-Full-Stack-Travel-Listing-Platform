const User = require("../models/user");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

// Redirect root
module.exports.redirect = (req, res) => {
    res.redirect("/listings");
};

// ✅ FIXED SIGNUP (NO next ANYWHERE)
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        const user = new User({ username, email, name });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, () => {
            req.flash("success", "Welcome to TripHaven!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
        console.log(err.stack); 
    }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

// Login
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

// Logout
module.exports.logout = (req, res) => {
    req.logout(() => {
        req.flash("success", "Logged out!");
        res.redirect("/listings");
    });
};
