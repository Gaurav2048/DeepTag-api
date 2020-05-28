const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'invalid email',
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  token: {
    type: String,
  },
  imageUri: {
    type: String,
  },
  follower: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Users', userSchema);
