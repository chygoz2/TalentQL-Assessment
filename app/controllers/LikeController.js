const { Router } = require("express");
const db = require("../models");
const { responseService } = require("../utils");
const { authenticateToken, canUnlikePost } = require("../middlewares");
const statusCodes = require("../constants/statusCodes");
const { body, validationResult } = require("express-validator");

const router = Router();

const doesPostExist = async (postId) => {
  const post = await db.Posts.findByPk(postId);
  if (!post) {
    return Promise.reject("Post does not exist");
  }
};

router.post(
  "/",
  authenticateToken,
  body("postId")
    .isInt()
    .withMessage("postId must be an integer")
    .custom(doesPostExist),
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
      const like = await db.Likes.findOrCreate({
        where: {
          userId: req.user.id,
          postId: req.body.postId,
        },
        defaults: {
          userId: req.user.id,
          postId: req.body.postId,
        },
      });

      return responseService(
        res,
        statusCodes.OK,
        "Post liked successfully",
        like
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

router.delete("/:id", authenticateToken, canUnlikePost, async (req, res) => {
  try {
    const like = req.like

    await like.destroy();

    return responseService(res, statusCodes.OK, "Like deleted successfully");
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
});

module.exports = router;
