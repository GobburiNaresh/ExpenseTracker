const User = require('../models/signup');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderBoardofUsers = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('amount')), 'total_cost']],
            include : [
                {
                    model:Expense,
                    attributes: []
                }
            ],
            group: ['id'],
            order:[['total_cost','DESC']]
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
