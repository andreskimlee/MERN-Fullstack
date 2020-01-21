const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }, 
  photoURL: {
    type: String,
    required: true
  },
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },

  // isDeleted: { // come back to it verify naming convention. 
  //   type: Boolean,  
  // }

});

module.exports = Tweet = mongoose.model('photo', PhotoSchema);