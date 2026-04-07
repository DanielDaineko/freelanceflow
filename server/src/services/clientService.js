const prisma = require("../config/prisma");

const getClientsByUser = async (userId) => {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const createClient = async (userId, data) => {
  const { name, email, company, status, notes } = data;

  if (!name || name.trim().length < 2) {
    throw new Error("Client name must be at least 2 characters");
  }

  const client = await prisma.client.create({
    data: {
      name,
      email: email || null,
      company: company || null,
      status: status || "active",
      notes: notes || null,
      userId,
    },
  });

  return client;
};

const deleteClient = async (userId, clientId) => {
  const existingClient = await prisma.client.findFirst({
    where: {
      id: clientId,
      userId,
    },
  });

  if (!existingClient) {
    throw new Error("Client not found");
  }

  await prisma.client.delete({
    where: {
      id: clientId,
    },
  });

  return { message: "Client deleted successfully" };
};

const updateClient = async (userId, clientId, data) => {
  const { name, email, company, status, notes } = data;

  if (!name || name.trim().length < 2) {
    throw new Error("Client name must be at least 2 characters");
  }

  const existingClient = await prisma.client.findFirst({
    where: {
      id: clientId,
      userId,
    },
  });

  if (!existingClient) {
    throw new Error("Client not found");
  }

  const updatedClient = await prisma.client.update({
    where: {
      id: clientId,
    },
    data: {
      name,
      email: email || null,
      company: company || null,
      status: status || "active",
      notes: notes || null,
    },
  });

  return updatedClient;
};

module.exports = {
  getClientsByUser,
  createClient,
  updateClient,
  deleteClient,
};
