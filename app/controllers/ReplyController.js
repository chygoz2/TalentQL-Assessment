const { Router } = require("express");
const db = require("../models");
const { responseService } = require("../utils");
const { authenticateToken } = require("../middlewares");
const statusCodes = require("../constants/statusCodes");
const { body, validationResult } = require("express-validator");

const router = Router();

const doesPostExist = async (postId) => {
  const post = await db.Posts.findByPk(postId);
  if (!post) {
    return Promise.reject("Post does not exist");
  }
};

/**
 * This endpoint allows replying to a post
 */
router.post(
  "/",
  authenticateToken,
  body("body")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 character long"),
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
      const reply = await db.Replies.create({
        body: req.body.body,
        userId: req.user.id,
        postId: req.body.postId,
      });

      return responseService(
        res,
        statusCodes.CREATED,
        "Reply saved successfully",
        reply
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

module.exports = router;
