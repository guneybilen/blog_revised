const jwt = require('jsonwebtoken');
const signRefreshToken = require('../../module/signRefreshToken');
const UserModel = require('../../module/auth/user');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yetenek', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
async function signIn(user) {
  const dbuser = await UserModel.emailExist(user.email);

  const comparePassword = await dbuser.comparePassword(user.password);
  if (!comparePassword) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: 'Password is incorrect.' });
  }

  const accessToken = jwt.sign({ userId: dbuser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  // res.cookie('email', user.email, {
  //   maxAge: 60 * 60 * 1000,
  //   httpOnly: true,
  //   // domain key isi bozuyor. When set browser'da
  //   // cookie disappear oluyor.
  //   // domain: 'http://localhost:3000',
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  // });

  // res.cookie('accessToken', accessToken, {
  //   maxAge: 60 * 60 * 1000,
  //   httpOnly: true,
  //   // domain key isi bozuyor. When set browser'da
  //   // cookie disappear oluyor.
  //   // domain: 'http://localhost:3000',
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  // });

  const refreshToken = await signRefreshToken(dbuser._id);

  // res.cookie('refreshToken', refreshToken, {
  //   maxAge: 365 * 24 * 60 * 60 * 1000,
  //   httpOnly: false,
  //   // domain key isi bozuyor. When set browser'da
  //   // cookie disappear oluyor.
  //   // domain: 'http://localhost:3000',
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  // });

  const filter = { email: dbuser.email };
  const update = { refreshToken: refreshToken };
  await UserModel.updateOne(filter, update);

  // res.header('Authorization', `Bearer ${accessToken}`);
  return { accessToken, refreshToken };
  // res.redirect('/');
  // return Promise.reject(error).catch((error) => {
  //   // Will not execute
  //   console.log('caught in signIn', error.message);
  // });
}

module.exports = signIn;
