const express = require('express');
const router = express.Router();

const ownerModel = require("../models/owners-model");



if(process.env.NODE_ENV === "development"){
    router.post('/create', async (req, res) => {
        let owner = await ownerModel.find();
        if(owner.length>0){
            return res.status(504).send("Owner already Exist");
        }
        let {fullname, email, password} = req.body;

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        });

        res.status(201).send(createdOwner);
    });
}

router.get('/admin', (req, res) => {
    res.render("createproducts", { success: req.flash('success') });
});




module.exports = router;