import AppError from "./appError.js";

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export default NotFoundError;
