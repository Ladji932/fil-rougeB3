const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    match: /^[0-9]+$/, 
},
role: { type: String, enum: ['user', 'admin'], default: 'user' }

});

const userList = mongoose.model("UserList", UserSchema);

module.exports = userList