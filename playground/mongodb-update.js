// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");
  const db = client.db("TodoApp");

  // findOneAndUpdate(filter, update, options, callback)
  //   db
  //     .collection("Todos")
  //     .findOneAndUpdate(
  //       { _id: new ObjectID("5aea05c5c1a3801cb890eaf1") },
  //       {
  //         // See MongoDB docs Update Operators
  //         $set: {
  //           completed: true  // changes completed to true
  //         }
  //       }, {
  //         // Driver API: false instead returns the updated document
  //         returnOriginal: false
  //       }).then(result => {
  //         console.log(result);
  //       });

  // Prints:
  // { lastErrorObject: { n: 1, updatedExisting: true },
  //   value:
  //    { _id: 5aea05c5c1a3801cb890eaf1,
  //      text: 'Eat lunch',
  //      completed: true },
  //   ok: 1 }

  db
    .collection("Users")
    .findOneAndUpdate(
      { _id: new ObjectID("5ae9e80ec1a3801cb890dff7") },
      {
        // See MongoDB docs Update Operators
        $set: {
          name: "Janet" // changes name to Janet
        },
        $inc: {
          age: 1 // increments age by 1
        }
      },
      {
        returnOriginal: false
      }
    )
    .then(result => {
      console.log(result);
    });
});
