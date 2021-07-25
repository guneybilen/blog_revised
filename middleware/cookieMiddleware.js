const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
// const signRefreshToken = require("@app/module/signRefreshToken");
var colors = require("colors");

async function cookieMiddleware(req, res, user) {
  // console.log("user ", user);
  try {
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // domain key isi bozuyor. When set browser'da
      // cookie disappear oluyor.
      // domain: 'http://localhost:3000',
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    return true;
  } catch (e) {
    console.log(colors.red(e.message));
    return false;
  }
}

module.exports = cookieMiddleware;
