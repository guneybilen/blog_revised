const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const mongoose = require("../mongoose");
const Image = require("./image");

const { Schema } = mongoose;

// const mongoosePaginate = require("mongoose-paginate-v2");

const Blog = require("./blog");
const { stringify } = require("querystring");

const userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String, minLength: 8, maxLength: 70, required: true },
    firstName: String,
    lastName: String,
    locale: String,
    userName: {
      type: String,
      minLength: 3,
      maxLength: 30,
      lowercase: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    confirmationCode: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    blogId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: false,
      },
    ],
  },

  { timestamps: true }
);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    this.passwordChangedAt = Date.now();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.statics.emailExist = function (email) {
  return this.findOne({ email });
};

userSchema.statics.userNameExist = function (userName) {
  return this.findOne({ userName });
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;

  delete obj.email;

  delete obj.account;
  delete obj.resetPassword;

  return obj;
};

// userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
