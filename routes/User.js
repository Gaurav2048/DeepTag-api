module.exports = function(app) {
  const userController = require('../Controllers/User.controller');
  app.post('/api/v1/register', userController.createUser);
  app.post('/api/v1/login', userController.login);
};
