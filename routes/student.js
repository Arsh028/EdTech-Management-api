const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middlewares/auth');
const Role = require('../models/Role');
const Student = require('../models/Student');

// @route POST /
// @des  create a student
// @acess Private (student-create)
router.post('/', auth, async (req, res) => {
  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);

  let roleid = await Role.findOne({
    _id: user.roleId,
    scopes: 'student-create',
  });
  // console.log('id = ' + roleid);

  // console.log('req.body.name : ' + req.body.name);
  // console.log('req.body.id : ' + req.body.userId);
  // console.log('req.body.schoolId : ' + req.body.schoolId);
  if (roleid) {
    let student = await Student.findOne({
      name: req.body.name,
      userId: req.body.userId,
      schoolId: req.body.schoolId,
    });
    //if user already exist send msg
    if (student) {
      return res.status(400).json({
        status: true,
        errors: [{ message: 'student already exists' }],
      });
    }
    student = new Student({
      name: req.body.name,
      userId: req.body.userId,
      schoolId: req.body.schoolId,
    });

    await student.save();

    console.log('student = ' + student);
    return res.status(200).json({
      status: true,
      content: {
        data: student,
      },
    });
  }
  return res.status(200).json({
    status: false,
    message: 'unauthorized',
  });
});

// @route GET /
// @des  get all students
// @acess Private (student-get)
router.get('/', auth, async (req, res) => {
  let user = await User.findOne({ roleId: req.user.user.roleId });
  //console.log('user = ' + user);

  let roleid = await Role.findOne({
    _id: user.roleId,
    scopes: 'student-get',
  });
  if (roleid) {
    let allStudents = await Student.find();
    return res.status(200).json({
      status: true,
      content: {
        data: allStudents,
      },
    });
  }
  return res.status(200).json({
    status: false,
    message: 'unauthorized',
  });
});

module.exports = router;
