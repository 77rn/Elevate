const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config'); // Multer setup
const userModel = require("../models/user-model");
const { isLoggedin } = require('../middlewares/isLoggedin');

router.get('/profile/:id', isLoggedin, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password');
        res.render('profile', { user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/profile/:id', isLoggedin, upload.single('picture'), async (req, res) => {
    try {   
        const { fullname, email, contact } = req.body;
        let updateData = { fullname, email, contact };

        if (req.file) {
            updateData.picture = req.file.buffer;
        }

        
        

        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.redirect(`/account/profile/${updatedUser._id}`);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;