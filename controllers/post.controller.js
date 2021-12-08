const { validationResult } = require('express-validator'),
      Post = require('../models/posts.model'),
      User = require('../models/auth.model'),
      fs   = require('fs');

exports.getPosts = async (req , res , next) =>
{
    try
    {
       const currentPage = req.query.page || 1 , perPage = 2;
       const count = await Post.find({}).countDocuments();
       const posts = await Post.find({})
       .sort({created_at : -1})
       .skip((currentPage - 1) * perPage)
       .limit(perPage);
       res.status(200).json({message: 'Fetched posts successfully.' , posts : posts , totalItems : count });
    }
    catch(e)
    {
        res.status(500).send({status : 500 , error : e.message , success : false});   
    }
}

exports.createPost = async (req , res , next) =>
{
    try
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw err;
        }

        if(!req.file)
        {
            const error = new Error('Please upload image.');
            error.statusCode = 422;
            throw err;
        }

        const post = await new Post({...req.body , image : req.file.path , creator : req.userId});
        post.save();
        const user = await User.findById(req.userId);
        await user.posts.push(post);
        user.save();
        res.status(201).json({status : 201 , message : "Post Created Successfully.", post : post , creator : {_id : user._id , name : user.username}, success : true});
    }

    catch(e)
    {
        res.status(500).send({status : 500 , error : e.message , success : false});   
    }
}

exports.getPost = async (req , res , next) =>
{
    try
    {
        const post = await Post.findById(req.params.postId);
        res.status(200).json({status : 200 , message : "Post founded Successfully.", post : post , success : true});
    }

    catch(e)
    {
        res.status(500).send({status : 500 , error : e.message , success : false});   
    }
}

exports.updatePost = async (req , res ,next) =>
{
    try
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw err;
        }

        let post = await Post.findById(req.params.postId);
        if(!post)
        {
          throw { status: 404, message: "Post is not found!", success: false };
        }

        if(post.creator.toString() !== req.userId._id.toString())
        {
            throw { status: 403, message: "Not Authorizated!", success: false };
        }

        console.log(post.creator.toString());
        console.log(req.userId._id.toString());
        let image = req.file;

        if(image)
        {
            fs.unlinkSync(post.image);
            post.image = image.path;
        }

        post = await Post.findByIdAndUpdate(post._id , {$set : {...req.body , image : post.image}} , {new : true});
        res.status(200).json({status : 200 , message : "Post Updated Successfully.", post : post , success : true});
    }

    catch(e)
    {
        res.status(500).send({status : 500 , error : e.message , success : false});   
    }
}

exports.deletePost = async (req , res ,next) =>
{
    try
    {
        const post = await Post.findByIdAndRemove(req.params.postId);
        fs.unlinkSync(post.image);

        if(post.creator.toString() !== req.userId._id.toString())
        {
            throw { status: 403, message: "Not Authorizated!", success: false };
        }

        const user = await User.findById(req.userId);
        await user.posts.pull(post._id);
        user.save();
        res.status(200).json({status : 200 , message : 'Post Deleted Successfully' , success : true }); ;
    }

    catch(e)
    {
        res.status(500).send({status : 500 , error : e.message , success : false});   
    }
}