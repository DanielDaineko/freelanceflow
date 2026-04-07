const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {
  getAll,
  create,
  remove,
} = require("../controllers/transactionController");

const router = express.Router();

router.use(auth);

router.get("/", getAll);
router.post("/", create);
router.delete("/:id", remove);

module.exports = router;
