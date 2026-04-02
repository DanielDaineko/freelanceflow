const { getDashboardSummary } = require("../services/dashboardService");

const getSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummary(req.user.id);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
};
