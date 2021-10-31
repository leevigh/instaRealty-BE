require('dotenv').config()
var express = require('express');
const mongoose = require('mongoose')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const morgan = require('morgan')


var users = require('./routes/users');
// console.log(process.env.MONGODB_URL)

mongoose.Promise = Promise;

// 'mongodb://localhost:27017/instarealty'
mongoose.connect('mongodb://localhost:27017/instarealty', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongodb connection successful!")
}).catch(err => console.log(err.message))

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/v1/users', users);

module.exports = app;
