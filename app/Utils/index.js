exports.responseService = (res, statusCode, message, data, errors = null) => {
  return res.status(statusCode).json({
    message,
    data,
    errors,
  });
};
