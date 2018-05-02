const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");
  const db = client.db("TodoApp");

  db
    .collection("Todos")
    .find() // finds all docs
    .toArray()
    .then(
      docs => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
      },
      err => {
        console.log("Unable to fetch todos", err);
      }
    );

  db
    .collection("Todos")
    .find( // finds docs with completed === true
      { completed: true }
    )
    .toArray()
    .then(
      docs => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
      },
      err => {
        console.log("Unable to fetch todos", err);
      }
    );

  db
    .collection("Todos")
    .find( // finds specific document id
      { _id: new ObjectID("5ae98fd8e40e522228aa53de") }
    )
    .toArray()
    .then(
      docs => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
      },
      err => {
        console.log("Unable to fetch todos", err);
      }
    );

  db
    .collection("Todos")
    .find()
    .count()
    .then(
      count => {
        // finds number of docs
        console.log(`Todos count: ${count}`);
      },
      err => {
        console.log("Unable to fetch todos", err);
      }
    );

  db
    .collection("Users")
    .find({ name: "Andrew" })
    .toArray()
    .then(
      docs => {
        console.log("Users");
        console.log(JSON.stringify(docs, undefined, 2));
      },
      err => {
        console.log("Unable to to fetch users", err);
      }
    );
  client.close();
});
