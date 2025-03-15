const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const { logAction } = require('../utils/logger');

class TaskService {
  static buildWhereClause({ status, userTasksOnly, userId, adminUserId, taskId }) {
    let whereClause = '';
    const values = [];
    let paramIndex = 1;

    if (taskId && taskId !== '') {
      whereClause += whereClause ? ` AND id = $${paramIndex}` : ` WHERE id = $${paramIndex}`;
      values.push(parseInt(taskId, 10));
      paramIndex++;
    }

    if (userTasksOnly && userId && !adminUserId) {
      whereClause += whereClause ? ` AND user_id = $${paramIndex}` : ` WHERE user_id = $${paramIndex}`;
      values.push(userId);
      paramIndex++;
    }

    if (adminUserId && adminUserId !== '') {
      whereClause += whereClause ? ` AND user_id = $${paramIndex}` : ` WHERE user_id = $${paramIndex}`;
      values.push(parseInt(adminUserId, 10));
      paramIndex++;
    }

    if (status && status !== '') {
      whereClause += whereClause ? ` AND status = $${paramIndex}` : ` WHERE status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    return { whereClause, values };
  }

  static async getTasks({ status, sortBy = 'created_at', order = 'ASC', page = 1, limit = 5, userTasksOnly, userId, adminUserId, taskId }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 5;
    const offset = (pageNum - 1) * limitNum;

    const validSortFields = ['id', 'title', 'status', 'user_id', 'created_at'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { whereClause, values } = this.buildWhereClause({ status, userTasksOnly, userId, adminUserId, taskId });

    return Task.findAllRaw({
      whereClause,
      values,
      limit: limitNum,
      offset,
      sortBy: safeSortBy,
      order: safeOrder,
    });
  }

  static async createTask({ title, description, status = 'pending', userId }) {
    if (!title) throw new AppError('Title is required', 400);
    const task = await Task.create({ title, description, status, user_id: userId });
    logAction('create_task', userId, `Task ${title} created`);
    return task;
  }

  static async getTaskById(id) {
    const task = await Task.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    return task;
  }

  static async updateTask(id, updates, userId, userRole) {
    const task = await Task.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    if (task.user_id !== userId && userRole !== 'ADMIN') {
      throw new AppError('Access denied', 403);
    }
    const updatedTask = await Task.update(id, updates);
    logAction('update_task', userId, `Task ${task.title} updated`);
    return updatedTask;
  }

  static async deleteTask(id, userId, userRole) {
    const task = await Task.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    if (task.user_id !== userId && userRole !== 'ADMIN') {
      throw new AppError('Access denied', 403);
    }
    await Task.delete(id);
    logAction('delete_task', userId, `Task ${task.title} deleted`);
  }
}

module.exports = TaskService;