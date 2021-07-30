const express = require('express');
const router = express.Router();

const Role = require('../models/Role');
const { check, validationResult } = require('express-validator');

// @route POST /role
// @des  creates a new role
// @acess Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    // check('scope', 'Please include a scope').isLength({ min: 1 }),
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
    const { name, scopes } = req.body;

    try {
      let role = await Role.findOne({ name: name });
      //if user already exist send msg
      if (role) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'role already exists' }] });
      }
      role = new Role({
        name,
        scopes,
      });

      await role.save();

      // res.status(200).json(role);

      return res.status(200).json({
        status: true,
        content: {
          data: {
            _id: role._id,
            name: role.name,
            scopes: role.scopes,
            created: role.createDate,
            updated: role.updateDate,
          },
        },
      });

      res.send('ROLE is registered');
    } catch (err) {
      console.log(err);
      console.log('error in POST /role');
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
