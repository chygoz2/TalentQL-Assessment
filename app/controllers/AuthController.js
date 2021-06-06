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

router.post(
  "/signup",
  body("emailAddress").isEmail().custom(doesEmailExist),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Must be at least 6 characters long"),
  body("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Must be at least 2 characters long"),
  body("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Must be at least 2 characters long"),
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
        statusCodes.OK,
        "Registration successful",
        user
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

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
          statusCodes.OK,
          "User with provided email address does not exist"
        );
      }

      const data = {
        passwordResetToken: await generateResetToken(),
      };

      user.passwordResetToken = data.passwordResetToken;
      await user.save();

      return responseService(
        res,
        statusCodes.OK,
        "Password reset token generated",
        data
      );
    } catch (error) {
      return responseService(res, statusCodes.SERVER_ERROR, error.message);
    }
  }
);

router.post(
  "/reset-password/:token",
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Must be at least 6 characters long"),
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

router.get("*", (req, res) => {
  return responseService(res, statusCodes.NOT_FOUND, "Unknown route");
});

module.exports = router;
