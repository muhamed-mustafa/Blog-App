const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title :
    {
        type : String ,
        trim : true ,
        required : true
    },

    content :
    {
        type : String ,
        trim : true ,
        required : true
    },

    image :
    {
        type : String ,
        required : true
    },

    creator :
    {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : true
    },

} , {versionKey : false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const Post = mongoose.model("Post" , postSchema);

module.exports = Post;
