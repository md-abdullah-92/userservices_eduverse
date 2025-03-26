const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { findUserById } = require("../repositories/userRepository");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await findUserById(decoded.id);
    if (!req.user) throw new Error("User not found");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
});

module.exports = { protect };
