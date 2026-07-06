// error handler
const CustomError = require("../exceptions/CustomError");
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  // Handle Sequelize ValidationError
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    res.status(400).json({
      success: false,
      message: messages[0] || message,
    });
    return;
  }
  if (err.name === "ReferenceError") {
    res.status(500).json({
      success: false,
      message: err.message || "A reference error occurred.",
    });
    return;
  }
  // Do not log if the error is a CustomError
  if (!(err instanceof CustomError)) {
    console.log(err);
  }
  // Default error response
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
module.exports = errorHandler;