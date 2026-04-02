const prisma = require("../config/prisma");

const getProjectsByUser = async (userId) => {
  return prisma.project.findMany({
    where: { userId },
    include: {
      client: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const createProject = async (userId, data) => {
  const { title, description, status, budget, deadline, clientId } = data;

  if (!title || title.trim().length < 2) {
    throw new Error("Project title must be at least 2 characters");
  }

  if (!clientId) {
    throw new Error("Client is required");
  }

  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      userId,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const project = await prisma.project.create({
    data: {
      title,
      description: description || null,
      status: status || "planning",
      budget: budget ? Number(budget) : null,
      deadline: deadline ? new Date(deadline) : null,
      clientId,
      userId,
    },
    include: {
      client: true,
    },
  });

  return project;
};

const deleteProject = async (userId, projectId) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!existingProject) {
    throw new Error("Project not found");
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return { message: "Project deleted successfully" };
};

module.exports = {
  getProjectsByUser,
  createProject,
  deleteProject,
};
