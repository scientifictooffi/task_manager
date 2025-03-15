const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async create({ username, password }, role = 'USER') {
        // console.log('sfdsdfsd', password)
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at';
        const values = [username, hashedPassword, role];
        const { rows } = await pool.query(query, values); // res
        return rows[0]; // res.rows[0]
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async getAll() {
        const query = 'SELECT id, username, role, created_at FROM users';
        const { rows } = await pool.query(query);
        return rows;
    }

    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
}

module.exports = User;