const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  caption: String,
  image: {
    public_id: String,
    url: String,
  },
  description:{
     type:String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});
const Blog = mongoose.model("postSchema", postSchema);
module.exports = Blog;
