const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeature');

const authenticationMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticationMiddleware.authenticate,premiumFeatureController.getUserLeaderBoard);

module.exports = router;