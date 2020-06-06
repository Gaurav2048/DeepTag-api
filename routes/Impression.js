module.exports = function(app) {
  const User = require('../models/User');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');
  const impressionController = require('../Controllers/Impression.Controller');

  // Follow an user.
  app.post(
    '/api/v1/follow/:userId',
    verifyAuthToken,
    impressionController.followUser
  );

  // unfollow an user.
  app.post(
    '/api/v1/unfollow/:userId',
    verifyAuthToken,
    impressionController.unfollowUser
  );
};
