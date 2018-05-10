const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// $ heroku addons:create mongolab:sandbox
// $ heroku config
// provides the dbase link // MONGODB_URI: mongodb://heroku_...
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose}; 
// same as mongoose: mongoose
