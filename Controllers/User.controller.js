const User = require('../models/User');
const bcrypt = require('bcrypt');
const config = require('../Config/config');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
  };
  User.create(user)
    .then((data) => {
      console.log('success');

      res.status(200).json({
        status: true,
        message: 'registration successful.',
      });
    })
    .catch((err) => {
      console.log('error');
      let message;
      if (err.keyPattern.email !== undefined) {
        message = ' Email id already exists. ';
      }
      res.status(200).json({
        status: false,
        message,
      });
    });
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .select({ follower: 0, following: 0, __v: 0 })
    .then((user) => {
      console.log(user);

      if (!user) {
        res.status(204).send({ success: false, message: 'no user found' });
      }

      var isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        res.status(401).send({
          success: false,
          message: 'Email id or password does not matches',
          email: user.email,
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 60 * 60 * 24 * 30,
      });

      user.token = token;

      user
        .save()
        .then(() => {
          res.status(200).send({
            success: true,
            message: 'login success.',
            ...user._doc,
          });
        })
        .catch((err) => {
          // error in save state
          res.status(200).send({
            message: err.message,
            status: false,
          });
        });
    })
    .catch((err) => {
      res.status(200).send({
        message: err.message,
        status: false,
      });
    });
};
