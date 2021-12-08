const User = require('../models/auth.model');

validateUserData = (req , res , next) =>
{
    try
    {
        const specialCharactersValidator = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
        const emailValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const fields = ["username","password", "email"];

        fields.map(field =>
        {
            if(field in req.body)
            {
                if(field == "username")
                {
                    if(req.body.username.length < 8)
                    {
                        throw { status: 400, message: "Username must be more than 8 characters." }
                    }

                    if(specialCharactersValidator.test(req.body.username))
                    {
                        throw {message: "Username should not contain special characters."}
                    }

                    if(/\s/gi.test(req.body.username))
                    {
                        throw { status: 422, message: "Invalid username", success: false }
                    }
                }
            }

            if(field == 'email')
            {
                if(!emailValidation.test(req.body.email))
                {
                    throw { status: 422, message: "Invalid email", success: false }
                }
            }

            if(field == 'password')
            {
                if(!specialCharactersValidator.test(req.body.password))
                {
                    throw { status: 422, message: "Password must contain a special character.", success: false }
                }
            }
        });

        next();
    }
   
    catch(err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
}

validateIfUserDataExists = async (req , res , next) =>
{
    try
    {
        let user = await User.findOne({email : req.body.email});
        if(user)
        {
            throw { message: "Email is already in use" };
        }

        user = await User.findOne({username : req.body.username});
        if(user)
        {
            throw { message: "Username is already in use" };
        }

        next();
    }
   
    catch(err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
}

const authMiddlewares = {validateUserData , validateIfUserDataExists};

module.exports = authMiddlewares;
