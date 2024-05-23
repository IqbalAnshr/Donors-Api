const express = require('express');

const requestController = require('../controllers/requestController');
const donorController = require('../controllers/donorController');

const router = express.Router();


router.get('/request', requestController.getRequests);
router.get('/request/:requestId', requestController.getRequestById);

router.get('/donor', donorController.getDonors);
router.get('/donor/:donorId', donorController.getDonorById);

module.exports = router