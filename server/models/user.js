const mongoose = require("mongoose");
const validator = require("validator");

let User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      // Pass in validator.isEmail method, which returns boolean
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  // MongoDB's token array
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

module.exports = { User }; // same as User: User
