import { body } from "express-validator";

const signupValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .not()
    .matches(/\s/)
    .withMessage("Spaces is not allowed in username")
    .isLowercase()
    .withMessage("Username must be lowercase."),
  body("password")
    .notEmpty()
    .withMessage("Username is required.")
    .isStrongPassword({
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage("Weak password"),
];

const loginValidator = [
  body("username").notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

export { signupValidator, loginValidator };
