const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// POST endpoint to predict wait time and save to database
router.post('/predict', queueController.predictWaitTime);

// GET endpoint to fetch all stored records
router.get('/data', queueController.getAllData);

module.exports = router;
