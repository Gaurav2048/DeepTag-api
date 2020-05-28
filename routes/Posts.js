module.exports = function(app) {
  const Post = require('../models/Posts');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');

  app.post('/posts', (req, res) => {
    console.log('post inside');

    Post.create(req.body)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  // home page route
  app.get('/posts', verifyAuthToken, (req, res) => {
    Post.find({})
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  // get one post data
  app.get('/posts/:id', verifyAuthToken, (req, res) => {
    Post.find({ _id: req.params.id })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
};
