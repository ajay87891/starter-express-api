const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = "verificatonkeytotoken";


//ROUTE 1 Create user /api/auth/createUser
router.post(
  "/createUser",
  [
    body("firstname", "Enter a valid firstname").isLength({ min: 3 }),
    body("lastname", "Enter a valid lastname").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("PhoneNumber", "Enter a valid PhoneNumber").isNumeric(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry This Email Alredy exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: secPassword,
        email: req.body.email,
        PhoneNumber: req.body.PhoneNumber,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      console.error(error.error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 2 Authenticate user /api/auth/login

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please Use correct email and password" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please Use correct email and password" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      
      const authToken = jwt.sign(data, JWT_SECRET);
      let success = true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 3 Authenticate user /api/auth/getUser  ****Login Required****
router.post(
  "/getUser",fetchUser, async (req, res) => {
try {
  userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)



} catch (error) {
  console.error(error.error);
  res.status(500).send("Internal Server Error");
}

  })


module.exports = router;
