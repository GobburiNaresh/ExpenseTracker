const path = require('path');

const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');
const userauthentication = require('../middleware/auth')

router.post('/addExpense',userauthentication.authenticate ,expenseController.addExpense);

router.get('/getExpenses',userauthentication.authenticate ,expenseController.getExpenses);

router.delete('/deleteExpense/:id',userauthentication.authenticate ,expenseController.deleteExpense);


module.exports = router;