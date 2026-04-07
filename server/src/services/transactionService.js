const prisma = require("../config/prisma");

const getTransactions = async (userId) => {
  return prisma.transaction.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });
};

const createTransaction = async (userId, data) => {
  const { amount, note, projectId } = data;

  if (!amount || amount <= 0) {
    throw new Error("Amount must be positive");
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.transaction.create({
    data: {
      amount: Number(amount),
      note: note || null,
      projectId,
      userId,
    },
    include: { project: true },
  });
};

const updateTransaction = async (userId, transactionId, data) => {
  const { amount, note, projectId } = data;

  if (!amount || Number(amount) <= 0) {
    throw new Error("Amount must be positive");
  }

  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
  });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
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

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      amount: Number(amount),
      note: note || null,
      projectId,
    },
    include: {
      project: true,
    },
  });

  return updatedTransaction;
};

const deleteTransaction = async (userId, id) => {
  const tx = await prisma.transaction.findFirst({
    where: { id, userId },
  });

  if (!tx) {
    throw new Error("Transaction not found");
  }

  await prisma.transaction.delete({
    where: { id },
  });

  return { message: "Deleted" };
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
