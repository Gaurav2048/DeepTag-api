const Post = require('../models/Posts');

exports.addLike = (req, res) => {
  console.log('post inside');
  if (
    req.body.name === undefined ||
    req.body.imageUrl === undefined ||
    req.body.posterId === undefined ||
    req.params.postId === undefined
  ) {
    return res.status(304).send({
      status: false,
      message: ' not all required items found in the body. ',
    });
  }

  if (req.id === req.body.posterId) {
    return res.status(301).send({
      status: false,
      message: 'You cannot like your own post.',
    });
  }

  const likeObject = {
    userid: req.id,
    name: req.body.name,
    imageUrl: req.body.imageUrl,
  };

  Post.findOne({
    _id: req.params.postId,
    $or: [{ likeCount: 0 }, { 'likes.userid': { $ne: req.id } }],
  })
    .then((post) => {
      if (post) {
        post.likes.push(likeObject);
        post.likeCount = post.likeCount + 1;
        post
          .save()
          .then((post) => {
            res.status(200).send({
              status: true,
              message: 'post liked',
              postId: post._id,
            });
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      } else {
        res.status(401).send({
          status: false,
          message: 'Post is already liked by user.',
        });
      }
    })
    .catch((err) => {
      res.status(401).send({
        status: false,
        message: ' some error occured ',
        err,
      });
    });
};

exports.disLike = (req, res) => {
  Post.updateOne(
    { _id: req.params.postId },
    {
      $pull: { likes: { userid: req.id } },
      $inc: { likeCount: -1 },
    },
    { safe: true, multi: true }
  )
    .then((post) => {
      if (post) {
        res.status(200).send({
          status: true,
          message: 'Post unliked',
        });
      } else {
        res.status(401).send({
          status: false,
          message: ' some error occured.',
          post,
        });
      }
    })
    .catch((err) => {
      res.status(401).send({
        status: false,
        message: ' some error occured ',
        err,
      });
    });
};

exports.getAllLIkes = (req, res) => {
  Post.find({
    _id: req.params.postId,
  })
    .select({ likes: 1, likeCount: 1 })
    .then((doc) => {
      if (doc) {
        res.status(200).send({
          status: true,
          message: 'Like information',
          likes: doc[0].likes,
          likeCount: doc[0].likeCount,
        });
      } else {
        res.status(401).send({
          status: false,
          message: 'something went wrong.',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: 'Internal server error',
        err,
      });
    });
};
