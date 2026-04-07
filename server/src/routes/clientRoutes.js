const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getClients,
  createNewClient,
  updateExistingClient,
  removeClient,
} = require("../controllers/clientController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getClients);
router.post("/", createNewClient);
router.put("/:id", updateExistingClient);
router.delete("/:id", removeClient);

module.exports = router;
