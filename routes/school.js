const express = require('express');
const router = express.Router();
const merge = require('deepmerge');

const User = require('../models/User');
const auth = require('../middlewares/auth');
const Role = require('../models/Role');
const School = require('../models/School');
const Student = require('../models/Student');

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
    message: 'unauthorized',
  });
});

// @route GET /
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

// @route GET /students
// @des  get all schools info with students
// @acess Private (school-students)
router.get('/students', auth, async (req, res) => {
  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);
  let roleid = await Role.findOne({
    _id: user.roleId,
    scopes: 'school-students',
  });
  if (roleid) {
    let allSchools = await School.find();
    console.log('allschools = ' + allSchools);
    let obj = {};
    let arr = [];
    for (let i = 0; i < Object.keys(allSchools).length; i++) {
      let students = await Student.find({ schoolId: allSchools[i]._id });
      obj = {
        data: {
          _id: allSchools[i]._id,
          name: allSchools[i].name,
          city: allSchools[i].city,
          state: allSchools[i].state,
          country: allSchools[i].country,
          students: [students],
        },
      };
      //console.log('obj: ' + JSON.stringify(obj));
      //put objs into array
      arr = [...arr, obj];
      //console.log('arr = ' + JSON.stringify(arr));
    }

    // console.log('merged obj:' + JSON.stringify(merged));
    return res.status(200).json({ status: true, content: arr });
  }
});

module.exports = router;
