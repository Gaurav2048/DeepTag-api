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

exports.getUserProfile = (req, res) => {};
