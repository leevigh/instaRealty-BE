require('dotenv').config()
var express = require('express');
const mongoose = require('mongoose')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')


var users = require('./routes/users');
var rentals = require('./routes/rentals');
var index = require('./routes/index')

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

module.exports = app;
