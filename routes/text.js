const multer = require("multer");
const authorized = require("../authentication/authorized");
const { textController: TextController } = require("../controllers");
var colors = require("colors");

var storage = multer.memoryStorage();
var store = multer({ storage: storage });

module.exports = function (router, io) {
  router.get("/blogs", TextController.blogs);

  router.get("/blogs/:id", authorized, TextController.blog);

  router.delete("/blogs/:id", authorized, TextController.blogDelete);

  var cpUpload = store.fields([{ name: "files", maxCount: 4 }]);
  router.post(
    "/blogs",
    authorized,
    store.array("files", 4),
    TextController.blogPost
  );

  var cpUpload = store.fields([{ name: "files", maxCount: 1 }]);
  router.put(
    "/blogs/:id/edit",
    authorized,
    store.array("files", 1),
    TextController.blogEdit
  );

  router.post(
    "/comment",
    authorized,
    function (req, res, next) {
      res.locals.io = io;
      next();
    },
    TextController.commentPost
  );

  router.get("/comments/:blogId", authorized, TextController.commentBlog);

  router.delete(
    "/comment/:commentId",
    authorized,
    function (req, res, next) {
      res.locals.io = io;
      next();
    },
    TextController.commentDelete
  );
};
