const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getTasks,
  createNewTask,
  removeTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createNewTask);
router.delete("/:id", removeTask);

module.exports = router;
