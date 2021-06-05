const { Router } = require("express");
const bcrypt = require('bcrypt')
const db = require("../models");
const { responseService } = require("../Utils");
const statusCodes = require("../constants/statusCodes");
const { body, validationResult } = require("express-validator");

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
			password
		})
	
		return responseService(res, statusCodes.OK, "Registration successful", user);
	} catch (error) {
		return responseService(res, statusCodes.SERVER_ERROR, error.message);
	}
  }
);

module.exports = router;
