// // const passport = require("passport");
// var JwtStrategy = require("passport-jwt").Strategy,
//   ExtractJwt = require("passport-jwt").ExtractJwt;

// const UserModel = require("../models/user");

// module.exports = (passport) => {
//   var opts = {};
//   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//   opts.secretOrKey = process.env.SECRETORKEY;
//   passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//       // console.log("jwt_payload ", jwt_payload);
//       UserModel.findOne({ _id: jwt_payload.sub }, function (err, user) {
//         console.log("exp", jwt_payload.exp);
//         console.log("now", Date.now());
//         if (err) {
//           return done(err, false);
//         }
//         if (jwt_payload.exp < Date.now()) {
//           return done(err, false);
//         } else if (user) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//           // or you could create a new account
//         }
//       });
//     })
//   );
// };

const CookieStrategy = require("passport-cookie").Strategy;
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new CookieStrategy({ signed: false, passReqToCallback: true }, function (
      req,
      token,
      done
    ) {
      let decoded = jwt.verify(token, process.env.SECRETORKEY);
      // console.log(decoded);
      UserModel.findOne({ _id: decoded.sub }, function (err, user) {
        if (decoded.exp < Date.now()) {
          return done(err, false);
        } else if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
