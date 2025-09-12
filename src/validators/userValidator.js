import { body } from "express-validator";

const patchUserValidator = [
  body("username")
    .optional()
    .notEmpty()
    .withMessage("Username is required.")
    .not()
    .matches(/\s/)
    .withMessage("Spaces is not allowed in username")
    .isLowercase()
    .withMessage("Username must be lowercase."),
];

export { patchUserValidator };
