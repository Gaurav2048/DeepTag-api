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
  followerCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  follower: [
    {
      userid: {
        type: String,
      },
      name: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
    },
  ],
  following: [
    {
      userid: {
        type: String,
      },
      name: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Users', userSchema);
