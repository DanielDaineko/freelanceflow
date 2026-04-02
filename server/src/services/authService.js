const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { generateToken } = require("../utils/jwt");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
    },
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
