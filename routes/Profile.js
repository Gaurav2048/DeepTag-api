module.exports = function(app) {
  const Post = require('../models/Posts');
  const verifyAuthToken = require('../middlewares/LoginMiddleware');
  const profileController = require('../Controllers/Profile.Controller');

  // get profile data.
  app.get('/api/v1/profile', verifyAuthToken, profileController.getProfileData);

  // update profile data.
  app.post(
    '/api/v1/profile',
    verifyAuthToken,
    profileController.updateProfileData
  );

  // get particular user data.
  app.get(
    '/api/v1/userProfile',
    verifyAuthToken,
    profileController.getUserProfile
  );

  app.get(
    '/api/v1/userInfo/:user_id/post/:post_id',
    verifyAuthToken,
    profileController.userAndPostInfo
  );
};
