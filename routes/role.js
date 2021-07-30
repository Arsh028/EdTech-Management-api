const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Role = require('../models/Role');

// @route POST /role
// @des  creates a new role
// @acess Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    //TODO check if scope is an array
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
          .json({ status: true, errors: [{ message: 'role already exists' }] });
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
    } catch (err) {
      console.log(err);
      console.log('error in POST /role');
      res.status(500).send('server error');
    }
  }
);

// @route GET /role
// @des  gets all roles
// @acess Private (role-get)

router.get('/', auth, async (req, res) => {
  //console.log('req.user = ' + (await JSON.stringify(req.user)));

  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);

  let id = await Role.findOne({ _id: user.roleId, scopes: 'user-get' });
  //console.log('id = ' + id);
  if (id) {
    let allroles = await Role.find();
    console.log('allroles = ' + allroles);
    return res.status(200).json({
      status: true,
      content: {
        data: allroles,
      },
    });
  }

  return res.status(200).json({
    status: false,
  });
});

module.exports = router;
// {
//   "content": {
//     "data": [
//       {
//         "_id": "60265e46d560814bb5a8e8bc",
//         "name": "Manager",
//         "scopes": [
//           "user-get",
//           "school-get",
//           "school-create"
//         ],
//         "created": "2021-02-12T10:55:51.306Z",
//         "updated": null
//       },
//       {
//         "_id": "60265e46d560814bb5a8e8bd",
//         "name": "Administrator",
//         "scopes": [
//           "user-get",
//           "student-get",
//           "student-create",
//           "role-get",
//           "school-get",
//           "school-create"
//         ],
//         "created": "2021-02-12T10:55:51.306Z",
//         "updated": null
//       }
//     ]
//   }
// }
