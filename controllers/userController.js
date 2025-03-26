const asyncHandler = require("express-async-handler");
const { registerUser, loginUser, updateUserProfile } = require("../services/userService");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updatedUser = await updateUserProfile(userId, req.body);
  res.json(updatedUser);
});

module.exports = { register, login, updateProfile };
