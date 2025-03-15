const User = require('../models/user');
const { logAction } = require('../utils/logger');
const AppError = require('../utils/AppError');

class UserService {
  static async getAllUsers(userRole) {
    if (userRole !== 'ADMIN') {
      throw new AppError('Access denied: Admin role required', 403);
    }
    const users = await User.getAll();
    if (!users || users.length === 0) {
      throw new AppError('No users found', 404);
    }
    return users;
  }

  static async deleteUser(id, requestingUserId, requestingUserRole) {
    if (requestingUserRole !== 'ADMIN') {
      throw new AppError('Access denied: Admin role required', 403);
    }

    if (parseInt(id) === requestingUserId) {
      throw new AppError('You cannot delete yourself', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await User.delete(id);
    logAction('delete_user', requestingUserId, `User ${user.username} deleted`);
  }
}

module.exports = UserService;