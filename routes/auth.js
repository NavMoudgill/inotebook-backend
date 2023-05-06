const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const {
  handleValidationError,
  handleInternalServerError,
  handleEmailError,
  handleUnauthorizedError,
} = require("../utils/errorHandler");

// Route1:creation of user using : POST "api/auth/createuser" no login required
router.post(
  "/createuser",
  [
    body("name", "Length of username should be atleast 3").isLength({ min: 3 }),
    body("email", "Not a valid e-mail address").isEmail(),
    body("password", "Length of password should be atleast 5")
      .isLength({
        min: 5,
      })
      .isStrongPassword()
      .withMessage(
        "Password should contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character"
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if errors are not empty ythen show message of error
    if (!errors.isEmpty()) {
      return res.json(handleValidationError(errors.array(), 400));
    }
    // check whether the user with same email exists already in the table users in database
    try {
      let myuser = await User.findOne({ email: req.body.email });
      if (myuser) {
        return res.json(handleEmailError(500));
      }

      const salt = bcrypt.genSaltSync(10);
      const secPassword = bcrypt.hashSync(req.body.password, salt);

      myuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      // In payload, we're giving user's id

      const authToken = jwt.sign(
        {
          myuser: { id: myuser.id },
        },
        process.env.JWT_SECRET
      );
      return res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.json(handleInternalServerError(500));
    }
  }
);

//Route 2: authentation login of user using : POST "api/auth/login" no login required
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Put a right e-mail address"),
    body("password").isLength(1).withMessage("Password can't be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if errors are not empty ythen show message of error
    if (!errors.isEmpty()) {
      return res.json(handleValidationError(errors.array(), 400));
    }
    // data inserted by user
    const { email, password } = req.body;
    try {
      let tuser = await User.findOne({ email });
      if (!tuser) {
        return res.json(handleUnauthorizedError(400));
      }
      const passwordCompare = await bcrypt.compare(password, tuser.password);
      if (!passwordCompare) {
        return res.json(handleUnauthorizedError(400));
      }
      const data = {
        myuser: { id: tuser.id },
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      return res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.json(handleInternalServerError(500));
    }
  }
);
// Route 3:authentation of getting user using : POST "api/auth/getuser" so we need token
//@authenicated route
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userID = req.user.id;
    // console.log(userID);
    let tuser = await User.findById({
      _id: userID,
    }).select("-password");
    //write me a code to catch the error when user is not found
    if (!tuser) {
      return res.json(handleUnauthorizedError(400));
    }

    return res.send(tuser);
  } catch (error) {
    console.error(error.message);
    res.json(handleInternalServerError(500));
  }
});

module.exports = router;
