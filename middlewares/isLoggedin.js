const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports.isLoggedin = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            req.flash("error", "You need to log in first");
            return res.redirect('/');
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("error", "User not found. Please sign in again.");
            return res.redirect('/');
        }

        req.user = user;
        res.locals.user = user;
        return next();
        
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            req.flash("error", "Your session has expired. Please log in again.");
        } else {
            req.flash("error", "Invalid authentication. Please log in again.");
        }
        return res.redirect('/');
    }
};
