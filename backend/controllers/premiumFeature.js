const User = require('../models/signup');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req,res) => {
    try{
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {}
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userDetailId]){
                userAggregatedExpenses[expense.userDetailId] = userAggregatedExpenses[expense.userDetailId] + expense.amount;
            }else{
                userAggregatedExpenses[expense.userDetailId] = expense.amount
            }   
        })
        var userLeaderBoardDetails = [];
        users.forEach((user) =>{
            userLeaderBoardDetails.push({name: user.name,total_cost: userAggregatedExpenses[user.id]})
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
        res.status(200).json(userLeaderBoardDetails);

    }catch (err){
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}