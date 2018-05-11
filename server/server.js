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

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// Create the routes
app.post("/todos", (req, res) => {
  let todo = new Todo({
    text: req.body.text
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

app.get("/todos", (req, res) => {
  Todo.find().then(
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

app.get("/todos/:id", (req, res) => {
  // Get the id off the request object parameters
  let id = req.params.id;
  // Validate data: 12 bytes and all is right?
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // Query dbase
  Todo.findById(id)
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

app.delete("/todos/:id", (req, res) => {
  // get the id
  let id = req.params.id;
  // validate the id -> if !valid...
  if (!ObjectID.isValid(id)) {
    // ...return and send status 404 with empty body
    return res.status(404).send();
  }
  // if valid, remove todo by id
  Todo.findByIdAndRemove(id)
    .then(todo => {
      // if no document by that id, promise returns null
      if (!todo) {
        // ...then return and send status 404 with empty body
        return res.status(404).send();
      }
      // if document id true, then removes and returns the document,
      // ...we send the document back in an object
      res.send({ todo });
    })
    .catch(e => {
      // if error, send res status 400 with empty body
      res.status(400).send();
    });
});

// patch is what we use to update a resource
app.patch("/todos/:id", (req, res) => {
  let id = req.params.id;
  // use _.pick() to pull a subset of the properties,
  // which user passed to us on the request object,
  // and to allow the users to only update those properties
  let body = _.pick(req.body, ["text", "completed"]);

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

  // Find by id and update
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
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
app.post("/users", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);
  let user = new User(body); // pass in body object

  user.save().then(
    user => {
      res.send(user);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
});

module.exports = { app }; // same as app: app
