module.exports = function(app) {
  const Post = require('../models/Posts');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');
  const likeController = require('../Controllers/Like.Controller');

  app.post('/api/v1/like/:postId', verifyAuthToken, likeController.addLike);

  // get like data on a post.
  app.get('/api/v1/like/:postId', verifyAuthToken, (req, res) => {
    Post.find({})
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
};
