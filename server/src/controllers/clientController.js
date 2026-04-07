const {
  getClientsByUser,
  createClient,
  updateClient,
  deleteClient,
} = require("../services/clientService");

const getClients = async (req, res) => {
  try {
    const clients = await getClientsByUser(req.user.id);
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNewClient = async (req, res) => {
  try {
    const client = await createClient(req.user.id, req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExistingClient = async (req, res) => {
  try {
    const client = await updateClient(req.user.id, req.params.id, req.body);
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeClient = async (req, res) => {
  try {
    const result = await deleteClient(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  createNewClient,
  updateExistingClient,
  removeClient,
};
