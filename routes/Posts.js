module.exports = function(app) {
  const Post = require('../models/Posts');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');
  const postController = require('../Controllers/Post.Controller');

  app.post('/api/v1/posts', postController.createPost);

  // home page route
  app.get('/api/v1/posts', verifyAuthToken, postController.getHomePageData);

  // get one post data
  app.get('/api/v1/posts/:id', verifyAuthToken, postController.getOnePost);
};
