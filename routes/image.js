const authorized = require("../authentication/authorized");
const ImageModel = require("../models/image");
const BlogModel = require("../models/blog");

const TITLE_LENGTH_MIN = 1;
const TITLE_LENGTH_MAX = 100;
const BODY_LENGTH_MIN = 1;
const BODY_LENGTH_MAX = 10000;

module.exports = function (router) {
  router.patch("/image/:id", authorized, async (req, res, next) => {
    // console.log("req ", req);
    let { blog: body } = req.body;
    let { title } = req.body;

    // console.log("title ", title);
    // console.log("body ", body);

    if (title.length < TITLE_LENGTH_MIN || title.length > TITLE_LENGTH_MAX)
      return res.json({ title_too_short_or_long: true });

    if (body.length < BODY_LENGTH_MIN || body.length > BODY_LENGTH_MAX)
      return res.json({ body_too_short_or_long: true });

    try {
      let { id } = req.params;
      // console.log(req.get("blogId"));
      const blogId = req.get("blogId");
      const blog = await BlogModel.findById(blogId).exec();
      let images = blog.imageId.filter((image) => image.toString() !== id);
      blog.body = body;
      blog.title = title;
      blog.imageId = images;
      await blog.save();
      await ImageModel.findByIdAndRemove(id).exec();
      return res.status(204).json({ success: true });
    } catch (error) {
      console.log(error.message);
      res.status(409).json({ success: false });
    }
  });
};
