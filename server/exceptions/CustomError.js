class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new CustomError(message, 400);
  }

  static notFound(message) {
    return new CustomError(message, 404);
  }

  static internal(message) {
    return new CustomError(message, 500);
  }
}

module.exports = CustomError;