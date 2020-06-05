const Post = require('../models/Posts');

exports.createPost = (req, res) => {
  Post.create(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
