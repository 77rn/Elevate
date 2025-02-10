const express = require("express");
const router = express.Router();
const { isLoggedin } = require('../middlewares/isLoggedin');
const productModel = require('../models/product-model');
const userModel = require("../models/user-model");

router.get("/",  (req, res) => {
    res.render("index", { error: req.flash('error'),success : req.flash('success'), loggedin: false });
});

router.get('/shop', isLoggedin, async (req, res) => {
    try {
        const query = req.query;
        let filterQuery = {};
        
        if (query.category) {
            switch (query.category) {
                case 'new':
                    filterQuery.createdAt = {
                        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    };
                    break;
                case 'discounted':
                    filterQuery.discount = { $gt: 0 };
                    break;
            }
        }

        if (query.minPrice || query.maxPrice) {
            filterQuery.price = {};
            if (query.minPrice) filterQuery.price.$gte = Number(query.minPrice);
            if (query.maxPrice) filterQuery.price.$lte = Number(query.maxPrice);
        }

        if (query.discount) {
            filterQuery.discount = { $gte: Number(query.discount) };
        }

        let sortOption = {};
        switch (query.sortby) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'price-low':
                sortOption = { price: 1 };
                break;
            case 'price-high':
                sortOption = { price: -1 };
                break;
            default: 
                sortOption = { createdAt: -1 };
        }

        const products = await productModel
            .find(filterQuery)
            .sort(sortOption);

        let success = req.flash("success");
        res.render("shop", { 
            products, 
            success,
            query 
        });

    } catch (error) {
        console.error('Shop route error:', error);
        req.flash("error", "Something went wrong while loading products");
        res.redirect("/");
    }
});

router.get("/cart/add/:id", isLoggedin, async (req, res)=>{
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success", "Added to cart successfully");
    res.redirect('/shop');
})

router.get("/cart", isLoggedin, async (req, res)=>{
    
    let user = await userModel.findOne({email: req.user.email}).populate("cart");
    
    res.render("cart", {user})
})

router.delete('/cart/remove/:id',isLoggedin, async (req, res) => {
    try {
        
        const productId = req.params.id;

        let user = await userModel.findOne({email: req.user.email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item._id.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;