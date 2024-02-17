const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require('path');
const session=require('express-session');
const flash=require('express-flash')
const userRoute=require('./routes/userRoute');
const adminRoute=require('./routes/adminRoute');
const config=require('./config/config')

const nocache = require('nocache');
const Razorpay =require('razorpay');
// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/user");

// Create Express app
const app = express();






//session
app.use(session({
  secret:config.sessionSecret,
  resave:false,
  saveUninitialized:true
}))

app.use(flash());
app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views',[ path.resolve(__dirname, 'views/user'),
path.resolve(__dirname, 'views/admin')]);

app.use(express.static('public',{ extensions: ['html', 'htm', 'webp', 'jpg', 'jpeg', 'png'] }));
app.use('/product',express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// Use the router defined in userRoute.js
app.use('/',userRoute);

// Use the router defined in adminRoute.js
app.use('/admin',adminRoute);


//error handiling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});



// Start the server
const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
