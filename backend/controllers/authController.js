const { validationResult } = require('express-validator');
const AuthService = require('../services/authService');
const { tryCatch } = require('../utils/tryCatch');
const AppError = require('../utils/AppError');

const register = tryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array());
  }

  const { username, password } = req.body;
  const result = await AuthService.register({ username, password });
  res.status(201).json(result);
});

const login = tryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array());
  }

  const { username, password } = req.body;
  const result = await AuthService.login({ username, password });
  res.status(200).json(result);
});

module.exports = { register, login };