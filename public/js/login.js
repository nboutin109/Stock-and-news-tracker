$(document).ready(function() {
  var loginForm = $("form.login");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When form is submitted, there is email and password validation //

  loginForm.on("submit", function(event) {
      event.preventDefault();
      var userData = {
          email: emailInput.val().trim(),
          password: passwordInput.val().trim()
      };

      if (!userData.email || !userData.password) {
          return;
      }

      // If we have email and password we run the loginUser function and clear the form //
      loginUser(userData.email, userData.password);
      emailInput.val("");
      passwordInput.val("");
  });

  // loginUser does a post to the api/login route and if it works, redirects a user to members page //

      function loginUser(email, password) {
          $.post("/api/login", {
              email: email,
              password: password
          })
          .then(function() {
              window.location.replace("/members");
              // If there is an error, console log the error
          })
          .catch(function(err) {
              console.log(err);
          });
      }
});