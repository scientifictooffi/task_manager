const UserService = require('../services/userService');
const { tryCatch } = require('../utils/tryCatch');

const getAllUsers = tryCatch(async (req, res) => {
  const users = await UserService.getAllUsers(req.user.role);
  res.json(users);
});

const deleteUser = tryCatch(async (req, res) => {
  await UserService.deleteUser(req.params.id, req.user.id, req.user.role);
  res.json({ message: 'User deleted' });
});

module.exports = {
  getAllUsers,
  deleteUser,
};