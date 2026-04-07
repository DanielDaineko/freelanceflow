const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getTasks,
  createNewTask,
  updateExistingTask,
  removeTask,
} = require("../controllers/taskController");
const { updateTask } = require("../controllers/taskController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createNewTask);
router.delete("/:id", removeTask);
router.put("/:id", updateExistingTask);
router.put("/:id", updateTask);

module.exports = router;
