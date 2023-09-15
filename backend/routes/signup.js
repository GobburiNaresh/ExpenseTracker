const path = require('path');

const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');

const expenseController = require('../controllers/expense');

const userauthentication = require('../middleware/auth')



router.post('/signup' ,userController.signup);

router.post('/login' ,userController.login);


router.get('/download', userauthentication.authenticate,expenseController.downloadExpense);





module.exports = router;