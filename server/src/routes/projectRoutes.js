const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProjects,
  createNewProject,
  updateExistingProject,
  removeProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProjects);
router.post("/", createNewProject);
router.put("/:id", updateExistingProject);
router.delete("/:id", removeProject);

module.exports = router;
