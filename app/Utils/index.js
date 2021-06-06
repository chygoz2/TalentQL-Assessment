const jwt = require("jsonwebtoken");

const responseService = (
  res,
  statusCode,
  message,
  data = null,
  errors = null
) => {
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

module.exports = {
  responseService,
  generateAccessToken,
};
