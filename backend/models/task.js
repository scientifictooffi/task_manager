const { pool } = require('../config/db');

class Task {
  static async create({ title, description, status, user_id }) {
    const query = 'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [title, description, status, user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id, { title, description, status }) {
    const query = 'UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *';
    const values = [title, description, status, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAllRaw({ whereClause = '', values = [], limit, offset, sortBy = 'created_at', order = 'ASC' }) {
    let query = `SELECT * FROM tasks ${whereClause}`;
    query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
    if (limit !== undefined && offset !== undefined) {
      query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);
    }
    const { rows } = await pool.query(query, values);

    const countQuery = `SELECT COUNT(*) FROM tasks ${whereClause}`;
    const { rows: countRows } = await pool.query(countQuery, values.slice(0, -2)); // Убираем limit и offset
    const total = parseInt(countRows[0].count, 10);

    return { items: rows, total };
  }
}

module.exports = Task;