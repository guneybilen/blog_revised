const jwt = require("jsonwebtoken");
const EXPIRY = 86400000; // cookie expires in one day. time is in milliseconds.

const cookieService = (res, payload) => {
  const expiresIn = EXPIRY;

  const token = jwt.sign(payload, process.env.SECRETORKEY, {
    expiresIn: expiresIn,
  });

  const expiration = Date.now() + EXPIRY;

  // on production
  // res.cookie("token", token, {
  //   expires: new Date(Date.now() + EXPIRY),
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production" ? true : false, // on production must be true
  //   sameSite: "none",
  // });
  // on production

  res.cookie("token", token, {
    expires: new Date(Date.now() + EXPIRY),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "lax",
    path: "/",
  });
};

module.exports = cookieService;
