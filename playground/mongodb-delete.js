// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");
  const db = client.db("TodoApp");

  // deleteMany;
  // db
  //   .collection("Todos")
  //   .deleteMany({ text: "Eat lunch" })
  //   .then(result => {
  //     console.log(result);
  //   });
      // prints result object, which contains...
      // CommandResult {result: { n: 3, ok: 1 }, ...
      // where n: 3 is number of docs deleted...
      // and ok: 1 means it worked as expected

  // deleteOne;
  // db
  //   .collection("Todos")
  //   .deleteOne({ text: "Eat lunch" })
  //   .then(result => {
  //     console.log(result);
  // });
        // prints result object, which contains...
        // CommandResult {result: { n: 1, ok: 1 }, ...
        // where n: 1 is number of docs deleted...

  // findOneAndDelete, which is useful as it returns the deleted doc value
  //   db
  //     .collection("Todos")
  //     .findOneAndDelete({ completed: false })
  //     .then(result => {
  //       console.log(result);
  // });
        // prints result object that is much shorter than deleteMany/One...
        // and that includes the value of the one document deleted
        // { lastErrorObject: { n: 1 },
        // value:
        //  { _id: 5ae98fd8e40e522228aa53de,
        //    text: 'Something to do',
        //    completed: false },
        //    ok: 1 }

  // findOneAndDelete, which is useful as it returns the deleted doc value
  // db
  //   .collection("Users")
  //   .deleteMany({ name: "Andrew" })
  //   .then(result => {
  //     console.log(result);
  //   });

  db
    .collection("Users")
    .findOneAndDelete({ _id: new ObjectID("5ae9932c45145c34e89e7872") })
    // make sure ObjectID has "ID" in caps just like at the top...
    .then(result => {
      console.log(result);
    });
  // prints...
  //   { lastErrorObject: { n: 1 },
  //    value:
  //  { _id: 5ae9932c45145c34e89e7872,
  //    name: 'John Abbot',
  //    age: 38,
  //    location: 'Toronto' },
  //   ok: 1 }

  //   client.close();
});
