// Table User {
//     _id ObjectId
//     --name String
//     ---email String [unique]
//     ----password String
//     ----created DateTime
//     roleId ObjectId [ref: > Role._id, default: null]
//     updated DateTime
//   }

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    default: 0,
  },
  password: {
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
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'role',
  },
});

module.exports = mongoose.model('user', UserSchema);
