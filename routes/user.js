const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');

// @route POST /signup
// @des  Register a user
// @acess Public
router.post(
  '/',
  [
    check('first_name', 'Name is required').not().isEmpty(),
    check('last_name', 'lastName is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log('request body =');
    console.log(req.body);

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //to store info of post request
    const { first_name, last_name, email, password, mobile } = req.body;

    try {
      let user = await User.findOne({ email: email });
      //if user already exist send msg
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] });
      }
      user = new User({
        first_name,
        last_name,
        mobile,
        email,
        password,
      });

      bcrypt.hash(password, saltRounds, function (err, hash) {
        user.password = hash;
      });
      await user.save();
      res.send('registered');
    } catch (err) {
      console.log(err);
      console.log('error in POST api/users');
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
