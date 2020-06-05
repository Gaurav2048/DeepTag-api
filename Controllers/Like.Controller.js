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
            res.status(200).send(post);
          })
          .catch((err) => {
            res.status(500).send(err);
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

  Post;
};
