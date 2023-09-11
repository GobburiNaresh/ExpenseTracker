const User = require('../models/signup');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderBoardofUsers = await User.findAll({
            order:[['totalExpenses','DESC']]
        });
        
        res.status(200).json(leaderBoardofUsers);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = {
    getUserLeaderBoard
};
