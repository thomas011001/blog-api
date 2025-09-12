import { body } from "express-validator";

const createPostValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("The length of the title must be between 2:50"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 500 })
    .withMessage("Text length must be under 500"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean value"),
];

export { createPostValidator };
