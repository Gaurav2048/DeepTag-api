const Post = require('../models/Posts');
const User = require('../models/User');

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
  let homePageData = {};

  if (res.skip !== 0) {
    // todo for pagination.

    return;
  }

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
    .then((posts) => {
      homePageData.near = posts;
      return Post.find({
        sort: { reviewCount: -1 },
        limit: 10,
      });
    })
    .then((posts) => {
      homePageData.popular = posts;
      return User.findOne({ _id: req.id }).select({ 'following.userid': 1 });
    })
    .then(({ following }) => {
      let ids = [];
      for (const el of following) {
        ids.push(el.userid);
      }
      console.log(ids);
      return getPostsByFollowing(ids, 0);
    })
    .then((posts) => {
      homePageData.following = posts;
      res.status(200).send(homePageData);
    })
    .catch((err) => {
      console.log('error is', err.message);

      res.status(500).send(err);
    });
};

const getPostsByFollowing = (ids, skip) => {
  return Post.find({
    user_id: { $in: ids },
  })
    .sort({ date: -1 })
    .limit(10)
    .skip(skip);
};
