const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middlewares/auth');
const Role = require('../models/Role');
const Student = require('../models/Student');

// @route POST /create
// @des  Register a user
// @acess Private (school-create)
router.post('/create', auth, async (req, res) => {
  let user = await User.findOne({ roleId: req.user.user.roleId });
  console.log('user = ' + user);

  //let id = await Role.findOne({ _id: user.roleId, scopes: 'school-create' });
  console.log('id = ' + id);
  if (id) {
    let student = await Student.findOne({
      name: req.body.name,
      userId: req.user.user.id,
      schoolId: req.user.user.schoolId,
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
      userId: req.user.user.id,
      schoolId: req.user.user.schoolId,
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
});

module.exports = router;
