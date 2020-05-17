const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const https = require('https');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/VegetablesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  notes: String
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req ,res){
  const contact = new Contact({
    name: req.body.fname,
    phone: req.body.phone,
    email: req.body.email,
    notes: req.body.notes
  });
  console.log(req.body.fname);
  console.log(req.body.phone);
  contact.save(function(err){
    if(!err){
      res.redirect("/");
    }
  })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
