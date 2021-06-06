const jwt = require('jsonwebtoken')
const statusCodes = require("../constants/statusCodes");
const db = require("../models");

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

  
module.exports = {
    authenticateToken,
    canEditPost,
  };
  