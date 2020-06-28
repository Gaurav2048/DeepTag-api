module.exports = function(app) {
  const Post = require('../models/Posts');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');
  const postController = require('../Controllers/Post.Controller');

  // create a fresh post
  app.post('/api/v1/posts', verifyAuthToken, postController.createPost);

  // home page route
  app.get(
    '/api/v1/posts/offset/:skip',
    verifyAuthToken,
    postController.getHomePageData
  );

  // get one post data
  app.get('/api/v1/posts/:id', verifyAuthToken, postController.getOnePost);

  // get already posted locations
  app.post('/api/v1/sanitize', verifyAuthToken, postController.sanitize);
};
