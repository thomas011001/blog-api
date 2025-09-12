import { body } from "express-validator";

const createCommentValidator = [
  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 100 })
    .withMessage("Text length must be under 100"),
];

export { createCommentValidator };
