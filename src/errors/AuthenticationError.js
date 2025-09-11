import AppError from "./appError.js";

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

export default AuthenticationError;
