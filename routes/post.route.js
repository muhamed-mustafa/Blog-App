const express  = require('express'),
      router   = express.Router(),
      { body } = require('express-validator'),
      postController = require('../controllers/post.controller'),
      isAuth    = require('../middlewares/verificationToken');

router.get('/posts' , postController.getPosts);

router.get('/post/:postId'  , postController.getPost);

router.post('/post' , [ body('title').trim().isLength({ min: 5 }),
                        body('content').trim().isLength({ min: 5 })
                      ],  isAuth , postController.createPost);

router.put('/post/:postId' , [ body('title').trim().isLength({ min: 5 }),
                               body('content').trim().isLength({ min: 5 })
                             ], isAuth , postController.updatePost);

router.delete('/post/:postId' , isAuth , postController.deletePost);

module.exports = router;
