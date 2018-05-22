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
  // MongoDB's tokens array
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

// Instance method (for user) to make JSON
UserSchema.methods.toJSON = function() {
  // Do not use arrow function, as we need value "this"
  let user = this;
  // Take mongoose user variable and convert to regular object
  let userObject = user.toObject();
  // Use _.pick() that only _id and email are returned with res
  return _.pick(userObject, ["_id", "email"]);
};

// Instance ethod to generate a user token
UserSchema.methods.generateAuthToken = function() {
  // Add instance methods with .methods to user (lowercase)
  // Do not use arrow functions, as we need value "this",
  let user = this;
  // instance methods get called with the individual
  // document as the "this" binding
  let access = "auth";
  let token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();
  // pass in _id string value instead of the object id
  // jwt.sign() returns an object, which we turn into a string

  // MongoDB's tokens...is overwritten...??
  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => {
    return token;
  });
};

// Instance method to remove token
UserSchema.methods.removeToken = function(token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

// Model method to find by token
UserSchema.statics.findByToken = function(token) {
  // Add model methods with .statics to User (uppercase)
  let User = this;
  // model methods get called with the model
  // as the "this" binding
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

// Model method to find by credentials
UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// Prior to save() to the dbase, check if password is
// new or changed, and if so, hash and salt the password
// then save password change and other changes to dbase
// otherwise, just save other changes to the dbase
UserSchema.pre("save", function(next) {
  // .pre runs the function before the "save" to the dbase
  // See Mongoose middleware for pre and post hooks
  let user = this;
  // prevent rehashing a password unless user.password changed
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next(); // "save" the document to the dbase
      });
    });
  } else {
    next(); // allows "save" of other non-password changes
  }
});

let User = mongoose.model("User", UserSchema);

module.exports = { User }; // same as User: User
