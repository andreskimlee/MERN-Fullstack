const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }  
});

module.exports = Tweet = mongoose.model('tweet', PhotoSchema);