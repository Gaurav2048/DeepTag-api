const User = require('../models/User');
exports.followUser = (req, res) => {
  if (req.id === req.params.userId) {
    res.status(405).send({
      status: false,
      message: 'You cannot follow yourself.',
    });
    return;
  }

  if (req.body.name === undefined || req.body.imageUrl === undefined) {
    return res.status(304).send({
      status: false,
      message: ' not all required items found in the body. ',
    });
  }

  const followObject = {
    userid: req.id,
    name: req.body.name,
    imageUrl: req.body.imageUrl,
  };

  User.findOne({
    _id: req.params.userId,
    $or: [{ followerCount: 0 }, { 'follower.userid': { $ne: req.id } }],
  })
    .then((user) => {
      if (user) {
        let followingName, followingUrl, followerId;
        user.follower.push(followObject);
        user.followerCount += 1;

        followingName = user.name;
        followingUrl = user.imageUrl || '';
        followerId = user._id;

        user
          .save()
          .then((updatedUser) => {
            return User.findOne({
              _id: req.id,
              $or: [
                { followingCount: 0 },
                { 'following.userid': { $ne: req.params.userId } },
              ],
            });
          })
          .then((user) => {
            if (user) {
              user.following.push({
                userid: followerId,
                name: followingName,
                imageUrl: followingUrl,
              });
              user.followingCount += 1;
              return user.save();
            } else {
            }
          })
          .then((user) => {
            return res.status(200).send({
              status: true,
              message: `Following ${followingName} `,
            });
          })
          .catch((err) => {
            res.status(501).send(err.message);
          });
      } else {
        res.status(401).send({
          status: false,
          message: 'User is already followed.',
        });
        return;
      }
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

exports.unfollowUser = (req, res) => {};
