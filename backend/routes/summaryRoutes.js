const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/summaryController');

const { authorize } = require('../middleware/roleMiddleware');

router.get('/', authorize(['viewer', 'analyst', 'admin']), getSummary);

module.exports = router;
