const Record = require('../models/Record');

// GET /api/summary
// Returns: totalIncome, totalExpense, balance, categoryTotals
const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Total income and expense via aggregation
    const totals = await Record.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach((item) => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });

    const balance = totalIncome - totalExpense;

    // Category-wise breakdown
    const categoryTotals = await Record.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Added: Recent Activity (last 5 records)
    const recentActivity = await Record.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ 
      totalIncome, 
      totalExpense, 
      balance, 
      categoryTotals,
      recentActivity 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary };
