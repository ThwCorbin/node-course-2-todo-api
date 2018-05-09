const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose.js");
const { Todo } = require("./../server/models/todo.js");
const { User } = require("./../server/models/user.js");

// Todo.remove({}) removes all documents
// But does not return the document

// Todo.remove({}).then(result => {
//   console.log(result);
// });
// $ node playground/mongoose-remove.js
// ...returns { n: 3, ok: 1 } 
// number deleted, 1 = success

// Todo.findOneAndRemove and Todo.findByIdAndRemove
// ...return the document
// ...or null if nothing with that id found

Todo.findByIdAndRemove("5af32cbf14f32bda1a83cc04").then(todo => {
  console.log(todo);
});
// $ node playground/mongoose-remove.js
// { completed: false,
//   completedAt: null,
//   _id: 5af32cbf14f32bda1a83cc04,
//   text: 'Something eles to do' }

// Todo.findOneAndRemove({_id: "5af32cbf14f32bda1a83cc04"}).then(todo => {
//     console.log(todo);
//   });