const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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
  // Use _.pick() to ensure password and token are not returned with res
  return _.pick(userObject, ["_id", "email"]);
};

// Adding instance methods to user (with small u)
// Do not use arrow functions, as we need value "this"
UserSchema.methods.generateAuthToken = function() {
  let user = this;
  // instance methods get called with the individual doc
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

UserSchema.statics.findByToken = function(token) {
  let User = this;
  // model methods get called with the model as this binding
  let decoded;

  try {
    decoded = jwt.verify(token, "abc123");
  } catch (e) {
    return Promise.reject();
    // instead of returning a new Promise and then immediately
    // rejecting it, we can return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        }else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre("save", function(next) {
  // See Mongoose middleware for pre and post hooks
  // .pre runs the function before the "save" to the dbase
  let user = this;
  // prevent rehashing a password unless user.password changed
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next(); // "save" the document to the dbase
      });
    });
    // next();
  } else {
    next(); // allows "save" of other changes if password not changed
  }
});

let User = mongoose.model("User", UserSchema);

module.exports = { User }; // same as User: User
