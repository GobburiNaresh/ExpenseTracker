const Sequelize = require('sequelize');

const sequelize = require('../util/database');

  const Expense = sequelize.define('expense-details', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt:{
      type: Sequelize.DATE,
      allowNull: true,
    }, 
    updatedAt:{
      type: Sequelize.DATE,
      allowNull: true,
    }

  });

module.exports = Expense;
