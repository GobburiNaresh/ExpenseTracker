const Expense = require('../models/expense');

const addExpense = async (req,res,next) =>{
    try{
    const {amount,description,category} = req.body;

    if(amount == undefined || amount.length <= 0){
        return res.status(400).json({success: false,message: 'parameters missing'})
    }
    
    const newExpense = await Expense.create({amount,description,category,userDetailId: req.user.id}) ///req.user.createExpense
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
    Expense.findAll({where : {userDetailId: req.user.id}}).then(expenses =>{
        return res.status(200).json({expenses, success: true});
    })
    .catch (err => {
        console.log(err);
        return res.status(500).json({ error:err,success: false});
    })
}

const deleteExpense = (req,res)=>{
    const expenseId = req.params.id;
    if(expenseId == undefined || expenseId.length === 0){
        return res.status(400).json({success: false})
    }
    Expense.destroy({where:{id : expenseId, userDetailId: req.user.id} }).then((noofrows) => {
        if(noofrows === 0){
            return res.status(400).json({success: false,message: 'Expense doesnot belong to user'});
        }
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