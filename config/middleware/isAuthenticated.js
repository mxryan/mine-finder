module.exports = function(req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  console.log("middleware hit 1");
  if (req.user) {
    return next();
  }
  console.log("middleware hit 2")

  // If the user isn't logged in, redirect them to the login page
  return res.redirect("/");
};