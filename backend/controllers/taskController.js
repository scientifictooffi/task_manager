const { validationResult } = require('express-validator');
const TaskService = require('../services/taskService');
const { tryCatch } = require('../utils/tryCatch');
const AppError = require('../utils/AppError');

const createTask = tryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array());
  }

  const { title, description, status } = req.body;
  const userId = req.user.id;
  const task = await TaskService.createTask({ title, description, status, userId });
  res.status(201).json(task);
});

const getTasks = tryCatch(async (req, res) => {
  const { status, sortBy, order, page, limit, userTasksOnly, adminUserId, taskId } = req.query;
  const userId = req.user.id;
  const result = await TaskService.getTasks({
    status,
    sortBy,
    order,
    page,
    limit,
    userTasksOnly,
    userId,
    adminUserId,
    taskId,
  });
  res.json(result);
});

const getTaskById = tryCatch(async (req, res) => {
  const task = await TaskService.getTaskById(req.params.id);
  res.json(task);
});

const updateTask = tryCatch(async (req, res) => {
  const task = await TaskService.updateTask(req.params.id, req.body, req.user.id, req.user.role);
  res.json(task);
});

const deleteTask = tryCatch(async (req, res) => {
  await TaskService.deleteTask(req.params.id, req.user.id, req.user.role);
  res.json({ message: 'Task deleted' });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};