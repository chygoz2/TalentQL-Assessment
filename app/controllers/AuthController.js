const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require("../models");
const {
  responseService,
  generateAccessToken,
  generateResetToken,
} = require("../utils");
const statusCodes = require("../constants/statusCodes");
const eventEmiiter = require("../utils/eventBus");

const router = Router();

const doesEmailExist = async (email) => {
  const user = await db.Users.findOne({ where: { emailAddress: email } });
  if (user) {
    return Promise.reject("Email address is already taken");
  }
};

/**
 * This endpoint allows registration of a user
 */
router.post(
  "/signup",
  body("emailAddress").isEmail().custom(doesEmailExist),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),
  body("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseService(
        res,
        statusCodes.BAD_REQUEST,
        "Validation failed",
        null,
        errors.array()
      );
    }

    const { emailAddress, password, firstName, lastName } = req.body;

    try {
      const user = await db.Users.create({
        emailAddress,
        firstName,
        lastName,
        password,
      });

      eventEmiiter.emit("user-registered", user);

      return responseService(
        res,
        statusCodes.CREATED,
        "Registration successful",
        user
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

/**
 * This endpoint allows a user to login using an email and a password
 */
router.post(
  "/login",
  body("emailAddress").notEmpty().withMessage("Email address is required"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseService(
        res,
        statusCodes.BAD_REQUEST,
        "Validation failed",
        null,
        errors.array()
      );
    }

    const { emailAddress, password } = req.body;

    try {
      const user = await db.Users.findOne({
        where: {
          emailAddress,
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return responseService(
          res,
          statusCodes.UNAUTHORIZED,
          "Incorrect email/password"
        );
      }

      let userJson = user.toJSON();
      userJson.token = generateAccessToken(userJson);

      return responseService(res, statusCodes.OK, "Login successful", userJson);
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

/**
 * This endpoint allows a user initiate a password reset if they 
 * forget their password
 */
router.post(
  "/forgot-password",
  body("emailAddress").notEmpty().withMessage("Email address is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseService(
        res,
        statusCodes.BAD_REQUEST,
        "Validation failed",
        null,
        errors.array()
      );
    }

    try {
      const user = await db.Users.findOne({
        where: {
          emailAddress: req.body.emailAddress,
        },
      });

      if (!user) {
        return responseService(
          res,
          statusCodes.FORBIDDEN,
          "User with provided email address does not exist"
        );
      }

      const passwordResetToken = await generateResetToken()

      user.passwordResetToken = passwordResetToken;
      await user.save();

      eventEmiiter.emit("initiate-password-reset", user);

      return responseService(
        res,
        statusCodes.OK,
        "Password reset token generated",
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

/**
 * This endpoint allows a user set a new password once in possession 
 * of a valid password reset token
 */
router.post(
  "/reset-password/:token",
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseService(
        res,
        statusCodes.BAD_REQUEST,
        "Validation failed",
        null,
        errors.array()
      );
    }

    try {
      const user = await db.Users.findOne({
        where: {
          passwordResetToken: req.params.token,
        },
      });

      if (!user) {
        return responseService(res, statusCodes.BAD_REQUEST, "Invalid token");
      }

      user.password = req.body.password;
      user.passwordResetToken = null;
      await user.save();

      return responseService(
        res,
        statusCodes.OK,
        "Password successfully reset"
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

module.exports = router;
