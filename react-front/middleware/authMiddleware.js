const jwt = require("token");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Токен приходит в формате "Bearer <token>"
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user; // Добавляем пользователя в запрос
    next();
  });
};

module.exports = authMiddleware;

const express = require("express");
const authMiddleware = require("./middlewares/authMiddleware");

const router = express.Router();

router.get("/tasks", authMiddleware, (req, res) => {
  res.json([{ id: 1, title: "Task 1", status: "pending" }]);
});

module.exports = router;
