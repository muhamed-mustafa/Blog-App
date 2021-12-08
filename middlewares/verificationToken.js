const User = require('../models/auth.model'),
      jwt  = require('jsonwebtoken');

module.exports = async (req , res , next) =>
{
    try
    {
        const token   = req.header("Authorization");
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user    = await User.findOne({_id : decoded._id});
        req.userId    = user;
        next();
    }   
    
    catch (err)
    {
        res.status(401).send({ status: 401, message: "Unauthorized", success: false });
    }
}

