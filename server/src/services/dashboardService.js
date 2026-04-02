const prisma = require("../config/prisma");

const getDashboardSummary = async (userId) => {
  const [clientsCount, projects, tasks] = await Promise.all([
    prisma.client.count({
      where: { userId },
    }),
    prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        budget: true,
      },
    }),
    prisma.task.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        dueDate: true,
      },
    }),
  ]);

  const activeProjectsCount = projects.filter(
    (project) => project.status === "active",
  ).length;

  const totalBudget = projects.reduce((sum, project) => {
    return sum + (project.budget || 0);
  }, 0);

  const now = new Date();

  const overdueTasksCount = tasks.filter((task) => {
    const taskDate = task.dueDate;
    return taskDate && task.status !== "done" && new Date(taskDate) < now;
  }).length;

  return {
    clientsCount,
    projectsCount: projects.length,
    tasksCount: tasks.length,
    activeProjectsCount,
    overdueTasksCount,
    totalBudget,
  };
};

module.exports = {
  getDashboardSummary,
};
