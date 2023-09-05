const path = require('path');

const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/signup' ,userController.signup);

// router.get('/get-order',orderController.getOrder);
  
// router.delete('/delete-order/:id',orderController.deleteOrder);


module.exports = router;