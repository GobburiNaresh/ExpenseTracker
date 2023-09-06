const Expense = require('../models/expense');

const addExpense = async (req,res,next) =>{
    try{
    const {amount,description,category} = req.body;

    if(amount == undefined || amount.length <= 0){
        return res.status(400).json({success: false,message: 'parameters missing'})
    }
    
    const newExpense = await Expense.create({amount,description,category})
      res.status(201).json({success:true,
        message:`Successfully created new user`,
        expense: newExpense,
    });
    }catch(err){
        console.log(err);
        res.status(500).json({success : false,error: err});
    }
}


const getExpenses = (req,res)=>{
    Expense.findAll().then(expenses =>{
        return res.status(200).json({expenses, success: true});
    })
    .catch (err => {
        return res.status(500).json({ error:err,success: false});
    })
}

const deleteExpense = (req,res)=>{
    const expenseId = req.params.id;
    Expense.destroy({where:{id: expenseId}}).then(() => {
        return res.status(204).json({ success: true,message:"delete successfully"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({success: false,message:failed})
    })
    
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense
}