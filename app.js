// require('dotenv').config()
const mongoose = require('mongoose')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')


let users = require('./routes/users');
let rentals = require('./routes/rentals');
let bookings = require('./routes/bookings')
let index = require('./routes/index')

mongoose.Promise = Promise;

// 'mongodb://localhost:27017/instarealty'
mongoose.connect( process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongodb connection successful!")
}).catch(err => console.log(err.message))

var app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/', index)
app.use('/api/v1/users', users);
app.use('/api/v1/rentals', rentals);
app.use('/api/v1/bookings', bookings)

module.exports = app;
