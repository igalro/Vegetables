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

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  note: String
});

const userInfoSchema = new mongoose.Schema({
  username: String,
  email: String
});

const Contact = mongoose.model("Contact", contactSchema);
const UserInfo = mongoose.model("UserInfo", userInfoSchema);

const priceList = {
  "Tomatoes": 5.5,
  "Cucumbers": 4,
  "Red-Peppers": 6.5,
  "Lettuce": 7,
  "Bok-Choy":12,
  "Asparagus": 24,
  "Apple-Pink-Lady": 14,
  "Bananas": 11,
  "Mango": 14
};


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

app.get("/cart",function(req, res) {
  res.render(__dirname + "/cart.ejs")
});

app.get("/login", function(req, res){
  res.render(__dirname + "/login.ejs")
});


//checkout cart
app.post("/", function(req, res){
  const reservation = req.body;
  const order = [];
  const orderPrices = [];
  let finalPrice = 0;
  for(const fruit in reservation){
    if(reservation[fruit] != 0){
      let quantity = `${reservation[fruit]}`;
      let item = `${fruit}`;
      order.push(`${fruit} : ${reservation[fruit]}`);
      let itemPrice = (quantity.match(/(\d+)/)[0]) * (priceList[item]);
      orderPrices.push(itemPrice);
      finalPrice += itemPrice;
    }
  };
    res.render(__dirname + "/cart.ejs", {
      order: order,
      numberItems: order.length,
      orderPrices: orderPrices,
      finalPrice: finalPrice
    });
  });


  app.post("/login", function(req, res){
    console.log(req.body);

  });


// contact form details - saved to the local mongoDB
app.post("/contact-us", function(req ,res){
  const contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    notes: req.body.note
  });
  contact.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
