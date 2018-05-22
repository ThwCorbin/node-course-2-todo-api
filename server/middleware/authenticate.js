// Authentication middleware:
// make routes private by requiring x-auth token
// is used when GET/POST/etc.

const { User } = require("./../models/user");

let authenticate = (req, res, next) => {
  let token = req.header("x-auth");
  User.findByToken(token)
    .then(user => {
      // make sure a user exists with this token
      // or authentication fails
      if (!user) {
        return Promise.reject();
      }
      // if user with token exists, we modify the req object
      // set req.user to the user just found
      // set req.token to the token above
      // modified req object is passed back to GET/POST/etc.
      req.user = user;
      req.token = token;
      next();
    })
    // if errors, authentication fails and GET/POST/etc stops
    .catch(e => {
      res.status(401).send();
    });
};

module.exports = { authenticate };
