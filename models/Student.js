// Table Student {
//     _id ObjectId
//     name String
//     userId ObjectId [ref: > User._id]
//     schoolId ObjectId [ref: > School._id]
//     created DateTime
//     updated DateTime
//   }

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('student', StudentSchema);
