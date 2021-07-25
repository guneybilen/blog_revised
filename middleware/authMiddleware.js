const { StatusCodes: HttpStatus } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const authMiddleware = {
  isAuth: async (req, res, next) => {
    // console.log(
    //   "authmidlleware isauth %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    // );
    if (
      req === undefined ||
      req.cookies === undefined ||
      req.cookies.refreshToken === undefined
    ) {
      res.locals.user = null;
      res.locals.userName = null;
      //res.flash("info", "lutfen giris yapiniz yada kayit olunuz...(ERR-1)");
      return res.render("index", { csrfToken: req.csrfToken() });
    }
    // console.log("req.cookies.refreshToken", req.cookies.refreshToken);
    if (req.cookies.refreshToken) {
      try {
        const decoded = jwt.verify(
          req.cookies.refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        // console.log("decoded ", decoded);
        const userByRefreshToken = await UserModel.findById(decoded.id, {
          email: 0,
          password: 0,
          blogs: 0,
        });

        // console.log("userByRefreshToken ", userByRefreshToken);
        if (!userByRefreshToken) {
          res.locals.user = null;
          res.flash(
            "info",
            "lutfen tekrar giris yapiniz yada kayit olunuz... (ERR-2)"
          );
          res.redirect("/");

          //          return res.render("index");
        } else {
          res.locals.user = userByRefreshToken._id;
          res.locals.userName = userByRefreshToken.userName;
          // return res.render("index", {
          //   kodName: userByRefreshToken.userName,
          // });
          next();
        }
      } catch (e) {
        console.log(e.message);
        res.locals.user = null;
        res.locals.userName = null;
        res.flash(
          "info",
          "lutfen tekrar giris yapiniz yada kayit olunuz...(ERR-3)"
        );
        next();

        //        return res.render("index");
      }
    }
  },

  isGuest: async (req, res, next) => {
    // const {
    //   context: { user },
    // } = req;

    if (req && req.context && req.context.user) {
      res.flash("warn", `giris yapmistiniz`);
      return res.redirect("/");
      // return res
      //   .status(HttpStatus.FORBIDDEN)
      //   .json({ error: 'You have already authorized.' });
    }

    return next();
  },

  isVerified: async (req, res, next) => {
    const {
      context: {
        user: {
          account: {
            verification: { verified },
          },
        },
      },
    } = req;

    if (!verified) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ error: "You must be verified." });
    }

    return next();
  },

  isUnverfied: async (req, res, next) => {
    const {
      context: {
        user: {
          account: {
            verification: { verified },
          },
        },
      },
    } = req;

    if (verified) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ error: "You have already verified." });
    }

    return next();
  },
};

module.exports = authMiddleware;
