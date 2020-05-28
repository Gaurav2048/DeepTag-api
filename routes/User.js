module.exports = function(app) {
  const userController = require('../Controllers/User.controller');
  app.post('/register', userController.createUser);
  app.post('/login', userController.login);
};
