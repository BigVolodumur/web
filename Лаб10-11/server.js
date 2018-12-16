const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bluebird = require('bluebird');

const feedbackRoutes = require('./src/routes/feedback.routes');
const newsRoutes = require('./src/routes/news.routes');

const app = express();
const port = 8000;

mongoose.Promise = bluebird;
mongoose.connect('mongodb://rootroot1:rootroot1@ds129914.mlab.com:29914/lab1011', { useNewUrlParser: true }, () => {
  console.log('Connected to the db');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', feedbackRoutes);
app.use('/api', newsRoutes);


app.use(express.static(__dirname + '/client'));

app.listen(port, () => console.log(`Listening at ${port}`));
