const mongoose = require("../mongoose");
const { Schema } = mongoose;
const Image = require("./image");
const Comment = require("./comment");
// const VideoURL = require("./videoURL");
const mongoosePaginate = require("mongoose-paginate-v2");

const blogSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, minLength: 1, maxLength: 100, required: true },
    body: { type: String, minLength: 1, maxLength: 10000, required: true },
    blogAuthorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    imageId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        required: false,
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
