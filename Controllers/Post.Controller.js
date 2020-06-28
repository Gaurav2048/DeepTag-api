const Post = require('../models/Posts');
const User = require('../models/User');

exports.createPost = (req, res) => {
  const user = req.body;
  user.user_id = req.id;
  Post.create(user)
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
    .select({
      _id: 1,
      isMotorable: 1,
      likeCount: 1,
      reviewCount: 1,
      images: 1,
      user_id: 1,
      name: 1,
      description: 1,
      state: 1,
      date: 1,
      'likes.imageUrl': 1,
    })
    .then((posts) => {
      homePageData.near = posts;
      return Post.find({})
        .limit(2)
        .select({
          location: 0,
          reviews: 0,
          likes: 0,
          __v: 0,
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
    .skip(skip)
    .select({ location: 0, reviews: 0, likes: 0, __v: 0 });
};

exports.sanitize = (req, res) => {
  console.log('sanitize', req.body.latitude + ' ' + req.body.longitude);

  Post.find({
    location: {
      $near: {
        $maxDistance: 250,
        $geometry: {
          type: 'Point',
          coordinates: [req.body.longitude, req.body.latitude],
        },
      },
    },
  })
    .select({ _id: 1, name: 1, images: 1, state: 1, country: 1 })
    .then((posts) => {
      if (posts) {
        return res.status(200).send({
          status: true,
          message: 'Data found',
          places: posts,
          err: {},
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: 'Internal server error',
        places: [],
        error: err,
      });
    });
};
