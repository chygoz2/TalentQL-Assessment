const { Router } = require("express");
const db = require("../models");
const { responseService } = require("../utils");
const { authenticateToken, canEditPost } = require("../middlewares");
const statusCodes = require("../constants/statusCodes");
const { body, validationResult } = require("express-validator");

const router = Router();

router.post(
  "/",
  authenticateToken,
  body("body")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 character long"),
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
  canEditPost,
  body("body")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 character long"),
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

    await post.destroy();

    return responseService(res, statusCodes.OK, "Post deleted successfully");
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
});

router.post(
  "/:id/reply",
  authenticateToken,
  body("body")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 character long"),
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
      const post = await db.Posts.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!post) {
        return responseService(res, statusCodes.NOT_FOUND, "Post not found");
      }

      await db.Replies.create({
        body: req.body.body,
        userId: req.user.id,
        postId: req.params.id,
      });

      await post.reload({ include: { all: true, nested: true } });

      return responseService(
        res,
        statusCodes.OK,
        "Reply saved successfully",
        post
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const post = await db.Posts.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!post) {
      return responseService(res, statusCodes.NOT_FOUND, "Post not found");
    }

    await db.Likes.findOrCreate({
      where: {
        userId: req.user.id,
        postId: req.params.id,
      },
      defaults: {
        userId: req.user.id,
        postId: req.params.id,
      },
    });

    await post.reload({ include: { all: true, nested: true } });

    return responseService(
      res,
      statusCodes.OK,
      "Post liked successfully",
      post
    );
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
});

router.post("/:id/unlike", authenticateToken, async (req, res) => {
  try {
    const post = await db.Posts.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!post) {
      return responseService(res, statusCodes.NOT_FOUND, "Post not found");
    }

    const like = await db.Likes.findOne({
      where: {
        userId: req.user.id,
        postId: req.params.id,
      },
    });

    if (like) {
      await like.destroy();
    }

    await post.reload({ include: { all: true, nested: true } });

    return responseService(
      res,
      statusCodes.OK,
      "Post unlked successfully",
      post
    );
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
});

module.exports = router;
