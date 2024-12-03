// models/Post.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  parent: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  // To track if the post was edited
  edited: { type: Boolean, default: false },
  sessionId: { type: String, required: true },
});

module.exports = mongoose.model('Post', PostSchema);
