const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middlewares/auth');
const Role = require('../models/Role');
const School = require('../models/School');

// @route POST /
// @des  create a school
// @acess Private (school-create)
router.post('/', auth, async (req, res) => {
  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);
  let roleid = await Role.findOne({
    _id: user.roleId,
    scopes: 'school-create',
  });
  //console.log('id = ' + roleid);
  if (roleid) {
    // console.log('req.body.name : ' + req.body.name);
    // console.log('req.body.city : ' + req.body.city);
    // console.log('req.body.state : ' + req.body.state);
    // console.log('req.body.country : ' + req.body.country);
    let school = await School.findOne({
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    });
    //if user already exist send msg
    if (school) {
      return res.status(400).json({
        status: true,
        errors: [{ message: 'school already exists' }],
      });
    }
    school = new School({
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    });
    //console.log(school);
    await school.save();
    //console.log('school in schooljs = ' + school);
    return res.status(200).json({
      status: true,
      content: {
        data: school,
      },
    });
  }
  return res.status(400).json({
    status: false,
  });
});

// @route POST /
// @des  get all schools
// @acess Private (school-get)
router.get('/', auth, async (req, res) => {
  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);
  let roleid = await Role.findOne({
    _id: user.roleId,
    scopes: 'school-get',
  });
  if (roleid) {
    let allSchools = await School.find();
    return res.status(200).json({
      status: true,
      content: {
        data: allSchools,
      },
    });
  }
});
module.exports = router;
