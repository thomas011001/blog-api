import AppError from "./appError.js";

class InternalServerError extends AppError {
  constructor() {
    super("Internal Server Error", 500);
  }
}

export default InternalServerError;
