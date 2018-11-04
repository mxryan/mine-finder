const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const formidable = require("formidable");
const db = require("./models");
const PORT = process.env.PORT || 3000;
const path = require("path");
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res)=>{
  res.send("navigate to /signup or /login");
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public/signup.html"));
});

app.post("/api/login", passport.authenticate("local"), function (req, res) {
  console.log(req.user);
  console.log("hi");
  res.json("/stats");
});

app.post("/api/signup", function (req, res) {

  // Create a new instance of formidable to handle the request info
  var form = new formidable.IncomingForm();

  // parse information for form fields and incoming files
  form.parse(req, function (err, fields) {
    console.log(fields);

    db.Users.create({
      email: fields.email,
      password: fields.password,
      username: fields.username,
    }).then(function (userInfo) {
      // Upon successful signup, log user in
      req.login(userInfo, function (err) {
        if (err) {
          console.log(err)
          return res.status(422).json(err);
        }
        console.log(req.user);
        return res.json("/stats");
      });
    }).catch(function (err) {
      console.log(err);
      res.status(422).json(err);
    });
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

db.sequelize.sync({force: false}).then(()=>{
  app.listen(PORT, ()=>{
    console.log("Listening @ port: " + PORT);
  })
});