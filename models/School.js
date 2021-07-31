// Table School as S {
//     _id ObjectId
//     name String
//     city String
//     state String
//     country String
//     created DateTime
//     updated DateTime
//   }

const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
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

module.exports = mongoose.model('school', SchoolSchema);
