const jwt = require('jsonwebtoken');
const config = require('../Config/config');

const verifyAuthToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) {
    res.status(403).send({
      success: false,
      message: 'No token found.',
    });
    return;
  }

  jwt.verify(token, config.secret, (err, decode) => {
    if (err) {
      res.status(403).send({
        success: false,
        message: 'Verification failed.',
        err,
      });
      return;
    } else {
      console.log(decode);
      req.id = decode.id;
      next();
    }
  });
};

module.exports = verifyAuthToken;
