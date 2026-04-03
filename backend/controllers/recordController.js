const Record = require('../models/Record');

// GET /api/records
// Supports query filters: ?type=income&category=salary&startDate=2024-01-01&endDate=2024-12-31
const getAllRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const records = await Record.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/records/:id
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/records
const createRecord = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  if (!amount || !type || !category || !date) {
    return res.status(400).json({ message: 'Amount, type, category, and date are required' });
  }

  try {
    const record = await Record.create({ amount, type, category, date, notes });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/records/:id
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/records/:id
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };
