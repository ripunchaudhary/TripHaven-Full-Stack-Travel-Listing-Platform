const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,   // duplicate emails prevent
    },
    name: {
        type: String,
        required: true,
    }
});

// Passport plugin
// ✔ adds: username, hash, salt
// ✔ adds: authenticate(), register(), serializeUser(), deserializeUser()
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
