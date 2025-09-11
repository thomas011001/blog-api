import AppError from "./appError.js";

class InternalServerError extends AppError {
  constructor() {
    super("nternal Server Error", 500);
  }
}

export default InternalServerError;
