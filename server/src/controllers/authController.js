const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../services/authService");

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  me,
};
