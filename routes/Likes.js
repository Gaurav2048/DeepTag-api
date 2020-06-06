module.exports = function(app) {
  const Post = require('../models/Posts');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');
  const likeController = require('../Controllers/Like.Controller');

  // like a post.
  app.post('/api/v1/like/:postId', verifyAuthToken, likeController.addLike);

  // dislike a post.
  app.post('/api/v1/dislike/:postId', verifyAuthToken, likeController.disLike);

  // get all likers of a post
  app.get('/api/v1/like/:postId', verifyAuthToken, likeController.getAllLIkes);
};
