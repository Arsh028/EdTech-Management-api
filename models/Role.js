// Table Role {
//     _id ObjectId
//     name String
//     scopes Array(String)
//     created DateTime
//     updated DateTime
//   }

const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  scopes: [String],
  createDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('role', RoleSchema);
