const jwt = require("jsonwebtoken");
const statusCodes = require("../constants/statusCodes");

const responseService = (res, statusCode, message, data, errors = null) => {
  return res.status(statusCode).json({
    message,
    data,
    errors,
  });
};

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_VALIDITY,
  });
};

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return responseService(
      res,
      statusCodes.UNAUTHORIZED,
      "Unauthorized operation"
    );
  }

  const parts = authorizationHeader.split(" ");
  if (parts.length != 2 || parts[0].toLowerCase() != "bearer" || !parts[1]) {
    return responseService(
      res,
      statusCodes.UNAUTHORIZED,
      "Unauthorized operation"
    );
  }

  const token = parts[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return responseService(res, statusCodes.FORBIDDEN, "Forbidden operation");
    }

    req.user = user;
    next();
  });
};

module.exports = {
  responseService,
  generateAccessToken,
  authenticateToken,
};
