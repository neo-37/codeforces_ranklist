const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    article_unique_key: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        default: null,
      },
    ],
    like_count: {
      type: Number,
      default: 0,
    },
    liked_by_me: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;

// articleId: Identifies the article to which the comment belongs.
// author: Stores the author's name.
// content: Contains the content of the comment.
// parentComment: References the parent comment if it's a reply. If it's null, it means it's a top-level comment.
// replies: An array of ObjectIds that reference other comments. These are the replies to the current comment.
