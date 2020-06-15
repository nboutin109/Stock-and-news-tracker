var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/signup", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
        res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
});

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("*", function(req, res) {
      if (req.user) {
          res.redirect("/members");
      }
      res.redirect("/login");
  })

};