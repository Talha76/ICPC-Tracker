const session = require("express-session");

module.exports = (app) => {
  app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  }));
}

