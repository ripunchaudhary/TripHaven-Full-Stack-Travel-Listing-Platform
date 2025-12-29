const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");

router.get("/", userController.redirect);

// ✅ SIGNUP (NO wrapAsync)
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signup);

// LOGIN
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.login
    );

router.get("/logout", userController.logout);

module.exports = router;
