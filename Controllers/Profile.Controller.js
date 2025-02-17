const User = require('../models/User');
const Post = require('../models/Posts');

exports.getProfileData = (req, res) => {
  let profileInfo = {};
  User.findOne({ _id: req.id })
    .select({
      name: 1,
      email: 1,
      followerCount: 1,
      followingCount: 1,
    })
    .then((doc) => {
      profileInfo.info = doc;
      return Post.find({
        user_id: req.id,
      }).select({
        _id: 1,
        isMotorable: 1,
        likeCount: 1,
        reviewCount: 1,
        name: 1,
        state: 1,
        description: 1,
        images: 1,
      });
    })
    .then((posts) => {
      profileInfo.posts = posts;
      res.status(200).send(profileInfo);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.updateProfileData = (req, res) => {};

// delivering entire information of user
// to android user profile page.
exports.getUserProfile = (req, res) => {
  console.log(req.id);
  let responseObj = {};
  User.findOne({
    _id: req.id,
  })
    .select({ followerCount: 1 })
    .then((count) => {
      console.log('1', count);

      responseObj = { followerCount: count.followerCount };
      return Post.find({
        user_id: req.id,
      }).select({
        name: 1,
        state: 1,
        description: 1,
        avgReview: 1,
        reviewCount: 1,
        images: 1,
      });
    })
    .then((places) => {
      responseObj = { ...responseObj, places };
      res.status(200).send(responseObj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// for post detail page in android
exports.userAndPostInfo = (req, res) => {
  // User.aggregate()
  //   .match({
  //     _id: req.params.user_id,
  //   })
  //   .project({
  //     following: {
  //       $cond: {
  //         if: {
  //           $eq: ['$follower.userid', req.id],
  //         },
  //         then: true,
  //         else: false,
  //       },
  //     },
  //     name: 1,
  //     imageUri: 1,
  //   })
  //

  let requiredObj = {};

  User.findOne({
    _id: req.params.user_id,
  })
    .select({ _id: 1, name: 1, imageUrl: 1 })
    .then((user) => {
      if (user) {
        console.log(user);

        requiredObj = { ...requiredObj, ...user._doc };
        return User.findOne({
          _id: req.params.user_id,
          'follower.userid': req.id,
        }).select({ 'follower.userid': 1 });
      }
    })
    .then((report) => {
      console.log('report', report);
      if (report && report.follower.length > 0) {
        requiredObj = { ...requiredObj, followingUser: true };
      } else {
        requiredObj = { ...requiredObj, followingUser: false };
      }

      return Post.findOne(
        { _id: req.params.post_id },
        {
          'reviews.reviewer.imageUrl': { $slice: [0, 4] },
          avgReview: 1,
          likeCount: 1,
          reviewCount: 1,
        }
      );
    })
    .then((data) => {
      requiredObj = { ...requiredObj, ...data._doc };
      console.log(requiredObj);

      res.status(200).send(requiredObj);
    })
    .catch((err) => {
      console.log(err);

      res.status(500).send(err);
    });
};
