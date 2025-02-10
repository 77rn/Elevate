const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');
const validator = require('validator');

module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname } = req.body;

        if (!fullname || !email || !password) {
            req.flash("error", "All fields are required");
            return res.redirect("/");
        }

        if (!validator.isEmail(email)) {
            req.flash("error", "Invalid email format");
            return res.redirect("/");
        }

        if (password.length < 8) {
            req.flash("error", "Password must be at least 8 characters long");
            return res.redirect("/");
        }

        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/");
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    req.flash("error", "Something went wrong. Please try again.");
                    return res.redirect("/");
                }
                let newUser = await userModel.create({
                    email,
                    password: hash,
                    fullname
                });
                let token = generateToken(newUser);
                res.cookie("token", token);
                req.flash("success", "Registration successful! Please log in.");
                res.redirect("/shop");
            });
        });

    } catch (err) {
        console.log(err.message);
        req.flash("error", "Server error. Please try again.");
        res.redirect("/");
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            req.flash("error", "Email and password are required");
            return res.redirect("/");
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash("error", "User does not exist");
            return res.redirect("/");
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);
                req.flash("success", "Login successful!");
                return res.redirect("/shop");
            }
            req.flash("error", "Wrong password");
            res.redirect("/");
        });

    } catch (err) {
        console.log(err.message);
        req.flash("error", "Server error. Please try again.");
        res.redirect("/");
    }
};

module.exports.logoutUser = (req, res) => {
    res.cookie("token", "");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
};
