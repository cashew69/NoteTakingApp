const express = require('express');
const router = require('./routes');
const app = express()


// view engine setup
app.set('views', (__dirname, 'views'));

app.set('view engine', 'ejs');
//Listen
app.listen(3000)
app.use('/', router)