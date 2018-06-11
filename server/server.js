// Use the server.js file to manage our routes
require("./config/config.js");

// 3rd party library imports
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

// Local imports
const { mongoose } = require("./db/mongoose.js");
const { Todo } = require("./models/todo.js");
const { User } = require("./models/user.js");
const { authenticate } = require("./middleware/authenticate");

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// CREATE THE ROUTES

app.post("/todos", authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    // only returns todos of user with specific x-auth
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});
// if we just use res.send(todos), we get an array...
// but ({todos: todos}) gets us an object...
// to which we can add other properties later

app.get("/todos/:id", authenticate, (req, res) => {
  // Get the id off the request object parameters
  let id = req.params.id;
  // Validate data: 12 bytes and all is right?
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // Query dbase
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete("/todos/:id", authenticate, async (req, res) => {
  // get the id
  const id = req.params.id;
  // validate the id -> if !valid...
  if (!ObjectID.isValid(id)) {
    // ...return and send status 404 with empty body
    return res.status(404).send();
  }
  // if valid, remove todo by id
  try {
    const todo =  await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    // if no document by that id, promise returns null
    if(!todo) {
      // ...then return and send status 404 with empty body
      return res.status(404).send();
    }
    // if document id true, then removes and returns the document...
    // ...we send the document back in an object
    res.send({ todo });
  } catch(e) {
    // if error, send res status 400 with empty body
    res.status(400).send();
  }
});

// Patch is what we use to update a resource
app.patch("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["text", "completed"]);
  // use _.pick() to pull a subset of the properties,
  // which user passed to us on the request object,
  // and to allow the users to only update those properties

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // Update the completedAt property off the completed property
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null; // removes from dbase
  }

  // Find one (by both id and creator) and update
  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
    { $set: body },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

// POST /users
app.post("/users", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  const user = new User(body); // pass in body object

  try {
    // save a new user
    await user.save();
    // then generate token using the generateAuthToken method
    // from User model's UserSchema.methods.generateAuthToken
    const token = await user.generateAuthToken();
    // await returns token, which we send to the user
    // with a custom response header
    //  using key/value '"x-auth": token' on the res object
    res.header("x-auth", token).send(user);
    // "x- indicates we are using a custom header"
  } catch (e) {
    res.status(400).send(e);
  }
});

// Fetch route for currently authenticated user
app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    // Generate and then send the user the key/value
    // '"x-auth": token' on the res object
    // with a custom response header
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete("/users/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
});

module.exports = { app }; // same as app: app
