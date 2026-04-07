const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} = require("../services/taskService");

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    const tasks = await getTasksByProject(req.user.id, projectId);
    res.status(200).json(tasks);
  } catch (error) {
    console.log("GET TASKS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const createNewTask = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    const task = await createTask(req.user.id, req.body);
    res.status(201).json(task);
  } catch (error) {
    console.log("CREATE TASK ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateExistingTask = async (req, res) => {
  try {
    const task = await updateTask(req.user.id, req.params.id, req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeTask = async (req, res) => {
  try {
    const result = await deleteTask(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.log("DELETE TASK ERROR:", error.message);
    res.status(404).json({ message: error.message });
  }
};
const prisma = require("../config/prisma");

const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createNewTask,
  updateExistingTask,
  removeTask,
  updateTask,
};
