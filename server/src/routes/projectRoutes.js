const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProjects,
  createNewProject,
  removeProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProjects);
router.post("/", createNewProject);
router.delete("/:id", removeProject);

module.exports = router;
