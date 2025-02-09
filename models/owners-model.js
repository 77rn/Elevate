const mongoose = require('mongoose');

const owenerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    products: {
        type: Array,
        default: []
    },
    picture: String,
    gstin: String
});

module.exports = mongoose.model("Owner", owenerSchema);