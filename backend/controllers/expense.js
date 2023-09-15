const Expense = require('../models/expense');
const User = require('../models/signup');
const sequelize = require('../util/database');
const S3Services = require('../services/s3services');
const servicesUser=require("../services/userServices")
const db = require('../models/downloadrecords')

const addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { amount, description, category } = req.body;
  
      if (amount == undefined || amount.length <= 0) {
        return res.status(400).json({ success: false, message: 'parameters missing' });
      }
  
      const expense = await Expense.create({ amount, description, category, userDetailId: req.user.id }, { transaction: t });
      const totalExpense = Number(req.user.totalExpenses) + Number(amount);
      User.update(
        {
          totalExpenses: totalExpense,
        },
        {
          where: { id: req.user.id },
          transaction: t,
        }
      )
        .then(async () => {
          await t.commit();
          res.status(200).json({
            success: true,
            message: `Successfully created new user`,
            expense: expense,
          });
        })
        .catch(async () => {
          await t.rollback();
          res.status(500).json({ success: false, error: err });
        });
    } catch (err) {
      await t.rollback();
      console.log(err);
      res.status(500).json({ success: false, error: err });
    }
  };
  


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

const getPageDetails = async (req,res) => {
  console.log("getting => users from Mysql");
  let page=req.query.pageNo||1;
  console.log(page);
  let items_per_page=+(req.query.items_per_page)|| 2 ;
  console.log("*******************")
  console.log(items_per_page);
  let totalPages;

  try{
    let count=await Expense.count({where:{userId:req.user.id}})
    console.log("count"+"id==>"+count)
    totalPages=count;
    let data=await req.user.getExpenses({offset:(page-1)*items_per_page,limit:items_per_page})
    // console.log(data)
    res.status(200).json({
      data,info:{
        currentPage: +page,
        hasNextPage: totalPages > page*items_per_page,
        hasPreviousPage:page>1,
        nextPage:+page+1,
        previousPage:+page-1,
        lastPage:Math.ceil(totalPages/items_per_page),
      }
    })
  }catch(err){
    console.log(err);
    res.status(500).json({success:false,err:err})
  }

}

const downloadExpense = async (req,res) => {
  try{
  const userDetailId = req.user.id;
  const expenses = await Expense.findAll({ where: { userDetailId: userDetailId }});
  const stringifiedExpenses = JSON.stringify(expenses);

  console.log('1',stringifiedExpenses)
  

  const filename = `Expense${userDetailId}/${new Date()}.txt`;
  console.log('2',filename)
  const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
  console.log(fileUrl)
  res.status(201).json({fileUrl , success: true}) 
}catch(err){
  console.log(err);
res.status(500).json({fileUrl:"Something==>went wrong",success:false})
}
}


// exports.saveDownloadRecord = (req, res) => {
//   const { user_id, file_url } = req.body;
//   const download_date = new Date(); 

//   db.query('INSERT INTO download_records (user_id, file_url, download_date) VALUES (?, ?, ?)',
//     [user_id, file_url, download_date],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to save download record' });
//       }
//       return res.status(201).json({ message: 'Download record saved successfully' });
//     });
// };

// exports.getDownloadRecords = (req, res) => {
//   const user_id = req.params.user_id;

//   db.query('SELECT * FROM download_records WHERE user_id = ? ORDER BY download_date DESC',
//     [user_id],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to retrieve download records' });
//       }
//       return res.status(200).json(results);
//     });
// };


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    downloadExpense,
    getPageDetails

}