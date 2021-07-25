var mongoose = require("mongoose");
const crypto = require("crypto");
var moment = require("moment");
var validator = require("validator");
const { cookieMiddleware } = require("../middleware/");
const UserModel = require("../models/user");
const { forgotPasswordMailService, signupMailService } = require("../service");
const { cookieService } = require("../service");
var assert = require("assert");
moment().format();

const USERNAME_LENGTH_MIN = 3;
const USERNAME_LENGTH_MAX = 30;
const PASSWORD_LENGTH_MIN = 8;
const PASSWORD_LENGTH_MAX = 70;

const userController = {
  sign_in: async (req, res, next) => {
    let user = await UserModel.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(401).json({ message: req.t("user_not_founrd") });
    }

    let isValid = user.comparePassword(req.body.password);

    if (!isValid) {
      return res.status(403).json({ message: req.t("incorrect_password") });
    }

    if (user.status != "Active") {
      return res.status(422).send({
        message: req.t("pending_account"),
      });
    }

    try {
      const payload = {
        sub: user._id,
        iat: Date.now(),
      };

      cookieService(res, payload);

      res.status(200).json({
        userName: user.userName,
        error: "",
        logged: true,
      });
    } catch (e) {
      res.status(400).json({ message: "a_technical_problem_occurred" });
    }
  },

  sign_up: async (req, res, next) => {
    let { email } = req.body;
    let { password } = req.body;
    let { passwordConfirm } = req.body;
    let { userName: userNameTemp } = req.body;

    if (!email || !password || !passwordConfirm || !userNameTemp)
      return res
        .status(409)
        .send({ message: req.t("please_provide_all_the_information1") });

    const token = crypto.randomBytes(32).toString("hex");

    let signupConfirmToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    userName = userNameTemp?.trimLeft().trimRight().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(411).send({ message: req.t("email_not_valid") });
    }

    let userForEmail = await UserModel.findOne({ email }).exec();

    if (userForEmail) {
      return res.status(409).send({ message: req.t("email_already_in_use") });
    }

    if (
      userName.length < USERNAME_LENGTH_MIN ||
      userName.length > USERNAME_LENGTH_MAX
    ) {
      return res.status(411).send({ message: req.t("userName_length") });
    }

    if (password !== passwordConfirm) {
      return res
        .status(403)
        .send({ message: req.t("password_and_confirm_equality") });
    }

    if (
      password.length < PASSWORD_LENGTH_MIN ||
      password.length > PASSWORD_LENGTH_MAX
    ) {
      return res.status(422).send({ message: req.t("password_length") });
    }

    let userForUserName = await UserModel.findOne({ userName }).exec();

    if (userForUserName) {
      return res
        .status(400)
        .send({ message: req.t("userName_already_in_use") });
    }

    let userCreated;
    // try {
    userCreated = new UserModel({
      _id: mongoose.Types.ObjectId(),
      email: email,
      password: password,
      userName: userName,
      confirmationCode: signupConfirmToken,
    });

    userCreated.save(function (error) {
      if (error) return console.error(error);
      else console.log("registraion of the user is successfull");
    });

    signupMailService(req, res, userCreated, signupConfirmToken);
  },

  forgotPassword: async (req, res, next) => {
    let user = await UserModel.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(401).json({ message: req.t("user_not_found") });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    forgotPasswordMailService(req, res, user, resetToken);
  },

  resetPassword: async (req, res, next) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).exec();
    if (!user) {
      return res
        .status(401)
        .json({ message: req.t("token_is_invalid_or_expired") });
    }

    let password = req.body.password;
    let passwordConfirm = req.body.passwordConfirm;

    if (!password || !passwordConfirm)
      return res
        .status(409)
        .send({ message: req.t("please_provide_all_the_information2") });

    if (
      password.length < PASSWORD_LENGTH_MIN ||
      password.length > PASSWORD_LENGTH_MAX
    ) {
      return res.status(422).json({
        message: req.t("password_length"),
      });
    }

    if (password !== passwordConfirm) {
      return res.status(403).json({
        message: req.t("password_and_confirm_equality"),
      });
    }

    try {
      const expiresIn = 86400000;
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      const payload = {
        sub: user._id,
        iat: Date.now(),
      };

      cookieService(res, payload);

      res.status(200).json({
        userName: user.userName,
        error: "",
        logged: true,
      });
    } catch (error) {
      console.error("resetPassword error in userController: ", error.message);
      res.status(500).json({
        message: req.t("technical_problem_when_logging"),
      });
    }
  },

  sign_out: (req, res, next) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      path: "/",
    });
    req.logout();
    res.json({
      token: "",
      loggedOut: true,
    });
  },

  changeUsername: async (req, res, next) => {
    let { changedName: changedNameTemp } = req.body;
    let { changedNameConfirm: changedNameConfirmTemp } = req.body;

    if (!changedNameTemp || !changedNameConfirmTemp)
      return res
        .status(409)
        .send({ message: req.t("please_provide_all_the_information3") });

    changedName = changedNameTemp?.trimLeft().trimRight().toLowerCase();
    changedNameConfirm = changedNameConfirmTemp
      .trimLeft()
      .trimRight()
      .toLowerCase();

    if (
      changedName.length < USERNAME_LENGTH_MIN ||
      changedName.length > USERNAME_LENGTH_MAX
    ) {
      return res.status(411).send({ message: req.t("userName_length") });
    }

    if (changedName !== changedNameConfirm) {
      return res.status(403).json({
        error: req.t("changedName_and_changedNameConfirm_must_be_equal"),
      });
    }

    let userForSearch = await UserModel.findById(req.userId).exec();

    if (userForSearch.userName === changedName) {
      return res
        .status(422)
        .send({ message: req.t("userName_already_in_use") });
    }

    let userForUserName = await UserModel.findOne({
      userName: changedName,
    }).exec();

    if (userForUserName) {
      return res
        .status(400)
        .send({ message: req.t("userName_already_in_use") });
    }

    try {
      const filter = { _id: req.userId };
      const update = { userName: changedName };

      // `doc` is the document _before_ `update` was applied
      let doc = await UserModel.findOneAndUpdate(filter, update);

      //retrieve the updated document
      doc = await UserModel.findOne(filter);

      return res.status(200).json({
        message: req.t("username_succseesfully_changed"),
        userName: doc.userName,
      });
    } catch (error) {
      console.error("in userController confirmAccount ", error.message);
      res.status(500).send({ message: req.t("server_error") });
    }
  },

  changePassword: async (req, res, next) => {
    let { password } = req.body;
    let { passwordConfirm } = req.body;

    if (
      password.length < PASSWORD_LENGTH_MIN ||
      password.length > PASSWORD_LENGTH_MAX
    ) {
      return res.status(411).send({ message: req.t("password_length") });
    }

    if (password !== passwordConfirm) {
      return res.status(403).json({
        error: req.t("password_and_confirm_equality"),
      });
    }

    try {
      const session = await UserModel.startSession();
      await session.withTransaction(async () => {
        const user = await UserModel.findById(req.userId).session(session);
        assert.ok(user.$session());
        user.passwword = password;
        assert.strictEqual(password, passwordConfirm);
        await user.save();
      });

      session.endSession();
      return res.status(200).json({
        message: req.t("password_succseesfully_changed"),
      });
    } catch (error) {
      console.error("in userController changePassword ", error.message);
      res.status(500).send({ message: req.t("server_error") });
    }
  },

  confirmAccount: async (req, res, next) => {
    let user = await UserModel.findOne({
      confirmationCode: req.params.token,
    }).exec();
    if (!user) {
      return res.status(404).send({ message: req.t("user_not_found") });
    }

    try {
      user.status = "Active";
      user.confirmationCode = undefined;
      await user.save();

      const payload = {
        sub: user._id,
        iat: Date.now(),
      };

      cookieService(res, payload);

      // when used with reactjs, use the following
      // res.redirect("/");

      // when used as an api, use the following
      res.status(201).send({ message: req.t("user_created") });
    } catch (error) {
      console.error("in userController confirmAccount ", error.message);
      res.status(500).send({ message: req.t("server_error") });
    }
  },
};

module.exports = userController;
