const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// $ heroku addons:create mongolab:sandbox
// $ heroku config
// provides the dbase link // MONGODB_URI: mongodb://heroku_...
// Checks if heroku app connects to our dbase || connects to localhost crashes app
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp");

module.exports = {mongoose}; 
// same as mongoose: mongoose
