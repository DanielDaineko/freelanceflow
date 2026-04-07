const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../services/transactionService");

const getAll = async (req, res) => {
  try {
    const data = await getTransactions(req.user.id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const create = async (req, res) => {
  try {
    const tx = await createTransaction(req.user.id, req.body);
    res.status(201).json(tx);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateExistingTransaction = async (req, res) => {
  try {
    const tx = await updateTransaction(req.user.id, req.params.id, req.body);
    res.status(200).json(tx);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteTransaction(req.user.id, req.params.id);
    res.json(result);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

module.exports = { getAll, create, updateExistingTransaction, remove };
