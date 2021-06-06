const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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

const generateResetToken = async (length = 4) => {
  const promise = new Promise((resolve, reject) => {
    crypto.randomBytes(length, function (err, buffer) {
      if (err) {
        return reject(err);
      }
      resolve(buffer.toString("hex"));
    });
  });
  const token = await promise;
  console.log(token);
  return token;
};

module.exports = {
  responseService,
  generateAccessToken,
  generateResetToken,
};
