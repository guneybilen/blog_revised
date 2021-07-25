// const mongoose = require("@app/mongoose");
const mongoose = require("../mongoose");

const { Schema } = mongoose;

const videoURLSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    path: String,
  },
  { timestamps: true }
);

const VideoURL = mongoose.model("videoURL", videoURLSchema);

module.exports = VideoURL;
