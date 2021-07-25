// const jwt = require("jsonwebtoken");

// // const redis = require('@app/redis');
// const UserModel = require("@app/module/auth/user");

// const authentication = async (req, res, next) => {
//   // console.log('req', req);

//   try {
//     Object.assign(req, { context: {} });

//     // console.log('req.cookies', req.cookies);

//     // const {
//     //   headers: { authorization },
//     // } = req;
//     // if (!authorization) {
//     //   return next();
//     // }

//     // const accessToken = authorization.split(' ')[1];
//     // console.log('accessToken', accessToken);

//     const accessToken = req.cookies.accessToken;

//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
//     //console.log('decoded', decoded);
//     if (decoded.userId === undefined) {
//       return next();
//     }

//     // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
//     // const isExpired = await redis.get(`expiredToken:${accessToken}`);
//     // console.log('isExpired', isExpired);

//     if (isExpired) {
//       return next();
//     }

//     const user = await UserModel.findById(decoded.userId);
//     //console.log('user', user);
//     if (user.email === undefined) {
//       return next();
//     }

//     // Object.assign(req, {
//     //   context: {
//     //     user,
//     //     accessToken,
//     //   },
//     // });

//     req.context.user = user;
//     req.context.accessToken = accessToken;

//     //console.log(
//     //  '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
//     //);
//     //console.log('req.context.user in authentication.js', req.context.user);
//     return next();
//   } catch (error) {
//     return next();
//   }
// };

// module.exports = authentication;
