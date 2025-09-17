import { hashSync } from "bcryptjs";
import { body } from "express-validator";
import ConflictError from "../errors/conflictError.js";

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
  body("passwrod")
    .optional()
    .notEmpty()
    .withMessage("Passwrod is required.")
    .isStrongPassword({
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage("Weak password")
    .customSanitizer((value) => hashSync(value, 10)),
  body("avatarUrl")
    .optional()
    .notEmpty()
    .withMessage("avatar url cant be empty")
    .isURL()
    .withMessage("the avatar url must be valide url"),
  body().custom((value, { req }) => {
    console.log(value, req.body);
    if (
      req.body.username === undefined &&
      req.body.passwrod === undefined &&
      req.body.avatarUrl === undefined
    ) {
      throw new ConflictError(
        "At least one of username, passwrod, or avatarUrl must be provided."
      );
    }
    return true;
  }),
];

export { patchUserValidator };
