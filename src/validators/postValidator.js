import { body } from "express-validator";
import ConflictError from "../errors/conflictError.js";

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
    .withMessage("isPublished must be boolean value")
    .toBoolean(),
];

const patchPostValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("The length of the title must be between 2:50"),
  body("text")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 500 })
    .withMessage("Text length must be under 500"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean value")
    .toBoolean(),
  body().custom((value, { req }) => {
    console.log(value, req.body);
    if (
      req.body.title === undefined &&
      req.body.text === undefined &&
      req.body.isPublished === undefined
    ) {
      throw new ConflictError(
        "At least one of title, text, or isPublished must be provided."
      );
    }
    return true;
  }),
];

export { createPostValidator, patchPostValidator };
