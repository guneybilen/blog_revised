const express = require("express");
const app = express();
const router = express.Router();
const io = require("../bin/www");
// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {
//   transports: ["websocket", "polling"],
// });

// const users = {};
// io.on("connection", (client) => {
//   client.on("username", (username) => {
//     console.log(username);
//     const user = {
//       name: username,
//       id: client.id,
//     };
//     users[client.id] = user;
//     io.emit("connected", user);
//     io.emit("users", Object.values(users));
//   });

//   // client.on("send", (message) => {
//   //   io.emit("message", {
//   //     text: message,
//   //     date: new Date().toISOString(),
//   //     user: users[client.id],
//   //   });
//   // });

//   client.on("disconnect", () => {
//     const username = users[client.id];
//     delete users[client.id];
//     io.emit("disconnected", client.id);
//   });
// });

// server.listen(process.env.PORT);

router.get("/routes", (req, res, next) => {
  var routes = [];
  var i = 0;
  router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      r.route.stack.forEach(function (type) {
        var method = type.method.toUpperCase();
        routes[i++] = {
          no: i,
          method: method.toUpperCase(),
          path: r.route.path,
        };
      });
    }
  });

  res.send("<h1>List of routes.</h1>" + JSON.stringify(routes));
});

require("./text")(router, io);
require("./user")(router);
require("./image")(router);

module.exports = router;
