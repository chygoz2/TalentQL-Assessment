const jwt = require("jsonwebtoken");
const multer = require("multer");
const statusCodes = require("../constants/statusCodes");
const { responseService } = require("../utils");
const db = require("../models");
const paths = require("../constants/paths");

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return responseService(res, statusCodes.UNAUTHORIZED, "Token not found");
  }

  const parts = authorizationHeader.split(" ");
  if (parts.length != 2 || parts[0].toLowerCase() != "bearer" || !parts[1]) {
    return responseService(res, statusCodes.UNAUTHORIZED, "Token not found");
  }

  const token = parts[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return responseService(res, statusCodes.FORBIDDEN, err.message);
    }

    req.user = user;
    next();
  });
};

const canEditPost = async (req, res, next) => {
  try {
    const post = await db.Posts.findByPk(req.params.id);

    if (!post) {
      return responseService(res, statusCodes.NOT_FOUND, "Post not found");
    }

    if (req.user.id != post.creatorId) {
      return responseService(
        res,
        statusCodes.FORBIDDEN,
        "Action is unauthorized"
      );
    }

    req.post = post;
    next();
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
};

const canUnlikePost = async (req, res, next) => {
  try {
    const like = await db.Likes.findByPk(req.params.id);

    if (!like) {
      return responseService(res, statusCodes.NOT_FOUND, "Like not found");
    }

    if (req.user.id != like.userId) {
      return responseService(
        res,
        statusCodes.FORBIDDEN,
        "Action is unauthorized"
      );
    }

    req.like = like;
    next();
  } catch (error) {
    return responseService(res, statusCodes.SERVER_ERROR, error.message);
  }
};

const imageFilter = (req, file, next) => {
  if (!file) {
    next();
  }
  else if (file.mimetype.startsWith("image")) {
    next(null, true);
  } else {
    next("Only images should be uploaded", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, process.cwd() + paths.UPLOADED_IMAGES);
  },
  filename: (req, file, next) => {
    next(null, `${Date.now()}-${file.originalname.replace(' ', '_')}`);
  },
});

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = {
  authenticateToken,
  canEditPost,
  canUnlikePost,
  uploadFile,
};
