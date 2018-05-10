const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server.js");
const { Todo } = require("./../models/todo.js");

// Create dummy/seed todos for testing
const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo"
  },
  {
    _id: new ObjectID(),
    text: "Second test todo"
  }
];

// This deletes all todoas and then provides seed data (todos) to test
beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => {
      done();
    });
});
// results in Error: Timeout of 2000ms exceeded ...
// until I added Andrew's line below in package.json...
// mocha --timeout=4000 server/**/*.test.js
// this may be cause be new version of Expect -- see lecture 104

describe("POST /todos", () => {
  it("should create a new todo", done => {
    let text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create todo with invalid body data", done => {
    let text = "Test todo text";

    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos:id", () => {
  it("should return todo doc", done => {
    // try to .get one of the todos' _id's we created above
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  });

  // I'm not convinced we need .toHexString()
  // let id = new ObjectID();
  // console.log(id); //5af379cb9854a42afc6fef2
  // console.log(id.toString()); //5af379cb9854a42afc6fef2
  // console.log(id.toHexString()); //5af379cb9854a42afc6fef2
  // And...
  // console.log(`/todos/${todos[0]._id}`);
  // console.log(`/todos/${todos[0]._id.toHexString()}`);
  // returns /todos/5af37c6b7538de1b98845041
  // returns /todos/5af37c6b7538de1b98845041

  it("should return 404 if todo not found", done => {
    // Create a new _id that is not a todo _id
    let hexId = new ObjectID().toHexString();
    // ...to make sure we return 404
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 if object id is invalid", done => {
    // try to .get an unvalid object _id like "123abc"
    // ...to make sure we return 404
    request(app)
      .get("/todos/123abc")
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    let hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query dbase to verify that _id does not exist === null
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeNull();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return 404 if todo not found", done => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 if object id is invalid", done => {
    request(app)
      .delete("/todos/123abc")
      .expect(404)
      .end(done);
  });
});
