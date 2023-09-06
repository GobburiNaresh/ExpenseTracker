const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const Order = require('./models/signup');
const Expense = require('./models/expense');

var cors = require('cors');

const app = express();

app.use(cors());

const userRoutes = require('./routes/signup');
const expenseRoutes = require('./routes/expense');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRoutes);
app.use('/expense',expenseRoutes);

sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });