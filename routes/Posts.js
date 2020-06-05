module.exports = function(app) {
  const Post = require('../models/Posts');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');
  const postController = require('../Controllers/Post.Controller');

  app.post('/api/v1/posts', postController.createPost);

  // home page route
  app.get('/api/v1/posts', verifyAuthToken, (req, res) => {
    Post.find({})
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  // get one post data
  app.get('/api/v1/posts/:id', verifyAuthToken, (req, res) => {
    Post.find({ _id: req.params.id })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
};
