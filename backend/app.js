const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const Order = require('./models/user');
var cors = require('cors');

const app = express();

app.use(cors());

const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);

sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });