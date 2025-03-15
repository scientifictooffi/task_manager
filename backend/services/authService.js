const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logAction } = require('../utils/logger');
const AppError = require('../utils/AppError');

class AuthService {
  static async register({ username, password }) {
    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new AppError('Username already exists', 400);
    }
    // console.log('before', password)
    const newUser = await User.create({ username, password });
    logAction('register', newUser.id, `User ${newUser.username} created`);
    return { message: 'User registered', userId: newUser.id };
  }

  static async login({ username, password }) {
    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    const user = await User.findByUsername(username);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    logAction('login', user.id, `User ${user.username} logged in`);
    return { token };
  }
}

module.exports = AuthService;