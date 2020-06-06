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

exports.getOnePost = (req, res) => {
  Post.find({ _id: req.params.id })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getHomePageData = (req, res) => {
  Post.find({
    location: {
      $near: {
        $maxDistance: 4000000,
        $geometry: {
          type: 'Point',
          coordinates: [77.102493, 28.70406],
        },
      },
    },
  })
    .then((post) => {
      res.status(200).send(post);
    })
    .catch((err) => {
      console.log('error is', err.message);

      res.status(500).send(err);
    });
};
