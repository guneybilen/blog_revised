const { userController: UserController } = require("../controllers");
const authorized = require("../authentication/authorized");

function clear(req, res, next) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "lax",
    path: "/",
  });
  req.logout();
  next();
}

module.exports = function (router) {
  router.get("/sign_out", authorized, UserController.sign_out);

  /* GET users listing. */
  router.get("/", function (req, res, next) {
    res.send("respond with a resource");
  });

  router.post("/sign_in", clear, UserController.sign_in);
  router.post("/sign_up", clear, UserController.sign_up);
  router.post("/forgotPassword", clear, UserController.forgotPassword);
  router.post("/resetPassword/:token", clear, UserController.resetPassword);

  router.post("/changeUsername", authorized, UserController.changeUsername);
  router.post("/changePassword", authorized, UserController.changePassword);

  router.get("/confirmAccount/:token", clear, UserController.confirmAccount);

  router.get("/protected", authorized, (req, res, next) => {
    // console.log(req);
    res.status(200).json({
      logged: true,
      userName: req.userName,
    });
  });
};
