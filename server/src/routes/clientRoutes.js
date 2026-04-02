const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getClients,
  createNewClient,
  removeClient,
} = require("../controllers/clientController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getClients);
router.post("/", createNewClient);
router.delete("/:id", removeClient);

module.exports = router;
