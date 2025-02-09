const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    image: Buffer,
    number: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    name: String
})

module.exports = mongoose.model("Product", productSchema);