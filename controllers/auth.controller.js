const User   = require('../models/auth.model'),
      bcrypt = require('bcrypt'),
      jwt    = require('jsonwebtoken');

exports.signup = async (req , res) =>
{
    try
    {
        const newUser = await new User({ ...req.body , password : bcrypt.hashSync(req.body.password , 10) });
        await newUser.save();
        res.status(200).send({ status: 200 , newUser , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.login = async (req , res , next) =>
{
    try
    {
        if (!req.body.username || !req.body.password)
        {
            throw { status: 422, message: "Invalid username or password", success: false };
        }

        let user, token;

        const emailValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (emailValidation.test(req.body.username))
        {
            user = await User.findOne({ email: req.body.username });
        }

        else
        {
            user = await User.findOne({ username: req.body.username });
        }

        // generate Token 
        token = jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET, 
        {
            expiresIn: '24h' // expires in 24 hour
        });    


          res.status(200).send({ status: 200 , token : token , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
}

exports.getUserStatus = async (req, res, next) => 
{
    try 
    {
      const user = await User.findById(req.userId);
      if (!user) 
      {
        throw {message: "User not found." , status  : 404}
      }

      res.status(200).json({ status: user.status });
    }
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.updateUserStatus = async (req, res, next) => 
{
    try 
    {
        const user = await User.findById(req.userId);
        
        if (!user) 
        {
            throw {message: "User not found." , status  : 404}
        }
        
        user.status = req.body.status;
        await user.save();
        res.status(200).json({ message: 'user status updated successfully.' });
    } 

    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};
  