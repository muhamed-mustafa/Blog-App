const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt'),
      jwt      = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email :
    {
        type : String ,
        trim : true ,
        required : true
    },

    password :
    {
        type : String ,
        trim : true ,
        required : true
    },

    username :
    {
        type : String ,
        trim : true ,
        required : true
    },

    status :
    {
        type : String ,
        default : "I am new!"
    },

    posts :
    [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Post"
        }
    ]

} , {versionKey : false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const User = mongoose.model("User" , userSchema);

userSchema.methods.generateAuthToken = async function () 
{
    const user = this;
    return jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET, 
    {
        expiresIn: '1h' // expires in one hour
    });
}


userSchema.pre("save" , async function()
{
    const user = this;
    if(user.isModified("password"))
    {
        user.password = bcrypt.hashSync(user.password , 10);
    }

});

module.exports = User;
