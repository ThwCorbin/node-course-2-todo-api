const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

let UserSchema = new mongoose.Schema({
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
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// Override intance methods to user (with small u)
// Do not use arrow functions, as we need value "this"
UserSchema.methods.toJSON = function() {
let user = this;
// Take mongoose user variable and convert to regular object
let userObject = user.toObject();
// Use _.pick() to ensure password and token are not returned
return _.pick(userObject, ["_id", "email"]);
};

// Adding instance methods to user (with small u)
// Do not use arrow functions, as we need value "this"
UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";
  let token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();
  // pass in _id string value instead of the object id
  // jwt.sign() returns an object, which we turn into a string

  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => {
    return token;
  });
};

let User = mongoose.model("User", UserSchema);

module.exports = { User }; // same as User: User
