const Sequelize = require('sequelize');

const sequelize = require('../util/database');

  const User = sequelize.define('user-details', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique:true,
    },
    password: {
      type: Sequelize.STRING,
      
    },
    ispremiumuser: {
      type: Sequelize.BOOLEAN,
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

module.exports = User;
