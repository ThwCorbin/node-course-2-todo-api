// Use the server.js file to manage our routes
// 3rd party library imports
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

// Local imports
const { mongoose } = require("./db/mongoose.js");
const { Todo } = require("./models/todo.js");
const { User } = require("./models/user.js");

let app = express();

app.use(bodyParser.json());

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
  let id = req.params.id;
  // Validate data
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

app.listen(3000, () => {
  console.log("Started on port 3000");
});

module.exports = { app }; // same as app: app
