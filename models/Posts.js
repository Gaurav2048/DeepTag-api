const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  isMotorable: {
    type: Boolean,
    default: true,
  },
  howtoreach: {
    type: String,
  },
  state: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  likes: [
    {
      userid: {
        type: String,
      },
      name: {
        type: String,
        require: true,
      },
      imageUrl: {
        type: String,
        require: true,
      },
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      rating: {
        type: Number,
        require: true,
      },
      title: {
        type: String,
      },
      review: {
        type: String,
      },
      id: {
        type: String,
        require: true,
      },
      imageUrl: {
        type: String,
        require: true,
      },
    },
  ],
  reviewCount: {
    type: Number,
    default: 0,
  },
  images: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
});
PostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Posts', PostSchema);
