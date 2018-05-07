const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose.js");
const { Todo } = require("./../server/models/todo.js");
const { User } = require("./../server/models/user.js");

let id = "5aecbe14005bcf284c30c0ef";
let user = "5aec6f67963da1293c954607";

// See mongoDB docs for ObjectID method .isValid
if (!ObjectID.isValid(id)) {
  // could do same thing with user
  console.log("Id is not valid");
}

Todo.find({
  _id: id
}).then(todos => {
  console.log("Todos", todos);
});
// Query returns all documents in an array
// ...if no results returns empty array

Todo.findOne({
  _id: id
}).then(todo => {
  console.log("Todo", todo);
});
// Query returns one result as a document
// ...if no results, returns null
// ...the same for .findById()

Todo.findById(id)
  .then(todo => {
    if (!todo) {
      return console.log("Id not found");
    }
    console.log("Todo by Id", todo);
  })
  .catch(e => console.log(e));

// NOTE: The app user will be supplying the id, thus we can use
// this data for error handling without breaking our app

User.findById(user)
  .then(user => {
    if (!user) {
      return console.log("User not found");
    }
    console.log("User by Id", user);
  })
  .catch(e => console.log(e));
