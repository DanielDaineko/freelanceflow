const prisma = require("../config/prisma");

const getTasksByProject = async (userId, projectId) => {
  return prisma.task.findMany({
    where: {
      userId,
      projectId,
    },
    orderBy: { createdAt: "desc" },
  });
};

const createTask = async (userId, data) => {
  const { title, description, priority, deadline, projectId } = data;

  if (!title || title.trim().length < 2) {
    throw new Error("Task title must be at least 2 characters");
  }

  if (!projectId) {
    throw new Error("Project is required");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority: priority || "medium",
      dueDate: deadline ? new Date(deadline) : null,
      projectId,
      userId,
    },
  });

  return task;
};

const updateTask = async (userId, taskId, data) => {
  const { title, description, priority, dueDate, status, projectId } = data;

  if (!title || title.trim().length < 2) {
    throw new Error("Task title must be at least 2 characters");
  }

  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title,
      description: description || null,
      priority: priority || "medium",
      status: status || "todo",
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
    },
  });

  return updatedTask;
};

const deleteTask = async (userId, taskId) => {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return { message: "Task deleted successfully" };
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};
