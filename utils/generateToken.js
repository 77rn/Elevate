const jwt = require("jsonwebtoken");

const generateToken = (user) =>{
    return jwt.sign({email: user.email, id: user._id}, process.env.JWT_KEY); //jwt.sign({email: email, id:user._id}, "secret", {expairesIn: '1hr'});
}

module.exports.generateToken = generateToken;