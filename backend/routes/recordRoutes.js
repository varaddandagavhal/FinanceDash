const express = require('express');
const router = express.Router();
const {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');

const { authorize } = require('../middleware/roleMiddleware');

// Analyst and Admin can READ detailed records
router.get('/', authorize(['analyst', 'admin']), getAllRecords);
router.get('/:id', authorize(['analyst', 'admin']), getRecordById);

// ONLY Admin can MANAGE (Create, Update, Delete)
router.post('/', authorize(['admin']), createRecord);
router.put('/:id', authorize(['admin']), updateRecord);
router.delete('/:id', authorize(['admin']), deleteRecord);

module.exports = router;
