const express = require("express");
const db = require("./models");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hey this is the home page");
});

db.sequelize.sync({force: false}).then(()=>{
  app.listen(PORT, ()=>{
    console.log("Listening @ port: " + PORT);
  })
});