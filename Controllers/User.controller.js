const User = require('../models/User');
const bcrypt = require('bcrypt');
const config = require('../Config/config');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res) => {
  const user = new User({
    title: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
  });
  user
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
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
            name: user.name,
            token: user.token,
            imageUrl: user.imageUrl,
            email: user.email,
          });
        })
        .catch((err) => {
          // error in save state
          res.status(500).send({
            error: err,
            status: false,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        error: err,
        status: false,
      });
    });
};
