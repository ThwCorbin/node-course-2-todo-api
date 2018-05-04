// Use the server.js file to manage our routes
// Library imports
const express = require("express");
const bodyParser = require("body-parser");

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

  todo.save().then((doc) => {
      res.send(doc);
  }, e => {
      res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log("Started on port 3000");
});

module.exports = {app}; // same as app: app