const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();
const jwtsecret = process.env.JWT_SECRET;

const User = require('../models/User');
const auth = require('../middlewares/auth');
const Role = require('../models/Role');

// @route POST /signup
// @des  Register a user
// @acess Public
router.post(
  '/signup',
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
    // console.log('request body =');
    // console.log(req.body);

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //to store info of post request
    const { first_name, last_name, email, password, mobile, roleId } = req.body;

    try {
      let user = await User.findOne({ email: email });
      //if user already exist send msg
      if (user) {
        return res.status(400).json({
          status: false,
          errors: [{ message: 'user already exists' }],
        });
      }
      user = new User({
        first_name,
        last_name,
        mobile,
        email,
        password,
        roleId,
      });

      bcrypt.hash(user.password, saltRounds, function (err, hash) {
        // console.log('user: ' + user);
        // console.log('user pass: ' + user.password);
        user.password = hash;
        user.save();
        // console.log('user pass: ' + user.password);
        // console.log('hash=' + hash);
        return res.status(200).json({
          status: true,
          content: {
            data: {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              mobile: user.mobile,
              password: user.password,
              roleId: user.roleId,
              created: user.createDate,
              updated: user.updateDate,
            },
          },
        });
      });
    } catch (err) {
      // console.log(err);
      // console.log('LINE 96 error in POST api/users');
      return res
        .status(400)
        .json({ status: false, errors: [{ message: 'something went wrong' }] });
    }
  }
);

// @route POST /signin
// @des  sign in a user
// @acess Public
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ status: false, errors: [{ message: 'user not found' }] });
  }
  //console.log('user = ' + user);

  bcrypt.compare(password, user.password, function (err, result) {
    // result == true
    if (result == true) {
      //login
      //Return jwt token
      const payload = {
        user: {
          id: user._id,
          roleId: user.roleId,
        },
      };

      jwt.sign(payload, jwtsecret, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          console.log('ERRROR IN JWT SECRET');
          console.log(err);
          throw err;
        }
        return res.status(200).json({
          status: true,
          content: {
            data: {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              mobile: user.mobile,
              password: user.password,
              roleId: user.roleId,
              created: user.createDate,
              updated: user.updateDate,
            },
          },
          token: token,
        });
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: 'something went wrong.' });
    }
  });
});

// @route POST /
// @des  get all users
// @acess Private (user-get)
router.get('/', auth, async (req, res) => {
  //console.log('req.user = ' + (await JSON.stringify(req.user)));

  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);

  let id = await Role.findOne({ _id: user.roleId, scopes: 'user-get' });
  //console.log('id = ' + id);
  if (id) {
    let alluser = await User.find();
    console.log('alluser = ' + alluser);
    return res.status(200).json({
      status: true,
      content: {
        data: alluser,
      },
    });
  }

  return res.status(400).json({
    status: false,
    message: 'unauthorized',
  });
});

// @route GET /
// @des  get single user
// @acess Private (user-get)
router.get('/:id', auth, async (req, res) => {
  //console.log('req.user = ' + (await JSON.stringify(req.user)));

  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);

  let idd = await Role.findOne({ _id: user.roleId, scopes: 'user-get' });
  //console.log('id = ' + idd);
  //console.log('req.params.id = ' + req.params.id);
  if (idd) {
    let single_user = await User.findOne({ _id: req.params.id });
    //console.log('single_user = ' + single_user);
    return res.status(200).json({
      status: true,
      content: {
        data: single_user,
      },
    });
  }

  return res.status(400).json({
    status: false,
    message: 'unauthorized',
  });
});

module.exports = router;
