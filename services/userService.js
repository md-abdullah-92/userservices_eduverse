const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser, findUserById, updateUser } = require("../repositories/userRepository");
const { sendMail } = require("./emailService");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const registerUser = async (name, email, password) => {
  if (await findUserByEmail(email)) throw new Error("User already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword });
  return { id: user.id, name: user.name, email: user.email, token: generateToken(user.id) };
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Invalid credentials");
  return { id: user.id, name: user.name, email: user.email, token: generateToken(user.id) };
};

const updateUserProfile = async (id, updateData) => {
  if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);
  return updateUser(id, updateData);
};

const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.BASE_URL}/api/users/verify/${token}`;
  await sendMail(email, "Verify Your Email", `Click here to verify: ${link}`);
};

module.exports = { registerUser, loginUser, updateUserProfile, sendVerificationEmail };
