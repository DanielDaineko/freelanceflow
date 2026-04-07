const {
  getProjectsByUser,
  createProject,
  updateProject,
  deleteProject,
} = require("../services/projectService");

const getProjects = async (req, res) => {
  try {
    const projects = await getProjectsByUser(req.user.id);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNewProject = async (req, res) => {
  try {
    const project = await createProject(req.user.id, req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExistingProject = async (req, res) => {
  try {
    const project = await updateProject(req.user.id, req.params.id, req.body);
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeProject = async (req, res) => {
  try {
    const result = await deleteProject(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createNewProject,
  updateExistingProject,
  removeProject,
};
