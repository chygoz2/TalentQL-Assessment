const { Router } = require("express");
const fs = require("fs");
const db = require("../models");
const { responseService } = require("../utils");
const {
  authenticateToken,
  canEditPost,
  uploadFile,
} = require("../middlewares");
const statusCodes = require("../constants/statusCodes");
const { body, validationResult } = require("express-validator");
const paths = require("../constants/paths");

const router = Router();

router.post(
  "/",
  authenticateToken,
  uploadFile.array("image", 5),
  body("body")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Post body must be at least 1 character long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseService(
        res,
        statusCodes.BAD_REQUEST,
        "Validation failed",
        null,
        errors.array()
      );
    }

    try {
      const post = await db.Posts.create({
        body: req.body.body,
        creatorId: req.user.id,
      });

      if (req.files) {
        for (let file of req.files) {
          await db.Images.create({
            postId: post.id,
            filePath: paths.UPLOADED_IMAGES + file.filename,
          });
        }
      }

      await post.reload({ include: { all: true, nested: true } });

      return responseService(res, statusCodes.CREATED, "Post saved", post);
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await db.Posts.findByPk(req.params.id, {
      include: { all: true, nested: true },
    });

    if (!post) {
      return responseService(res, statusCodes.NOT_FOUND, "Post not found");
    }

    return responseService(
      res,
      statusCodes.OK,
      "Post fetched successfully",
      post
    );
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
});

router.patch(
  "/:id",
  authenticateToken,
  uploadFile.array("image", 5),
  canEditPost,
  body("body")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Post must be at least 1 character long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseService(
        res,
        statusCodes.BAD_REQUEST,
        "Validation failed",
        null,
        errors.array()
      );
    }

    try {
      const post = req.post;

      post.body = req.body.body;
      await post.save();

      if (req.files) {
        for (let file of req.files) {
          await db.Images.create({
            postId: post.id,
            filePath: paths.UPLOADED_IMAGES + file.filename,
          });
        }
      }
      
      await post.reload({ include: { all: true, nested: true } });

      return responseService(
        res,
        statusCodes.OK,
        "Post updated successfully",
        post
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

router.delete("/:id", authenticateToken, canEditPost, async (req, res) => {
  try {
    const post = req.post;

    const images = await db.Images.findAll({
      where: {
        postId: req.params.id,
      },
    });

    await post.destroy();

    for (let image of images) {
      let path = `${process.cwd()}${image.filePath}`;
      fs.unlinkSync(path);
    }

    return responseService(res, statusCodes.OK, "Post deleted successfully");
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
});

module.exports = router;
