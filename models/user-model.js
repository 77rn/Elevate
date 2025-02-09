const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    contact: Number,
    picture: Buffer
});

module.exports = mongoose.model("User", userSchema);