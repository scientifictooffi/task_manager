const { Pool } = require('pg');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
// const initializeDatabase = require('./seed_data');

const parentDir = path.resolve(__dirname, '..');
require('dotenv').config({ path: parentDir+'\\\.env' });

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const initializeDatabase = async () => {
    try {
        const resUsers = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        if (!resUsers.rows[0].exists) {
            console.log('Creating table "users"');
            await pool.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            console.log('Populating table "users" with initial data');
            const users = [
                { username: 'user1', password: 'password123', role: 'USER' },
                { username: 'user2', password: 'password123', role: 'USER' },
                { username: 'admin', password: 'admin123', role: 'ADMIN' },
            ];

            for (const user of users) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await pool.query(`
                    INSERT INTO users (username, password, role)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (username) DO NOTHING;
                `, [user.username, hashedPassword, user.role]);
            }
            console.log('Initial users added');
        }

        const resTasks = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'tasks'
            );
        `);
        if (!resTasks.rows[0].exists) {
            console.log('Creating table "tasks"');
            await pool.query(`
                CREATE TABLE tasks (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            console.log('Populating table "tasks" with initial data');
            const tasks = [
                { title: 'Buy groceries', description: 'Milk, bread, eggs', status: 'pending', user_id: 1 },
                { title: 'Finish report', description: 'Work report for Q1', status: 'in_progress', user_id: 1 },
                { title: 'Call mom', description: 'Check in this weekend', status: 'completed', user_id: 1 },
                { title: 'Plan vacation', description: 'Research destinations', status: 'pending', user_id: 1 },
                { title: 'Fix bugs', description: 'Debug login issues', status: 'in_progress', user_id: 1 },
                { title: 'Review team tasks', description: 'Check progress', status: 'pending', user_id: 1 },
                { title: 'Schedule meeting', description: 'Team sync next week', status: 'in_progress', user_id: 1 },
                { title: 'Approve budget', description: 'Q2 expenses', status: 'completed', user_id: 1 },
                { title: 'Update policies', description: 'New security rules', status: 'pending', user_id: 1 },
                { title: 'Deploy app', description: 'Release v1.2', status: 'in_progress', user_id: 1 },

                { title: 'Workout', description: 'Gym at 6PM', status: 'pending', user_id: 2 },
                { title: 'Read book', description: 'Finish chapter 5', status: 'in_progress', user_id: 2 },
                { title: 'Meet friends', description: 'Dinner at 7PM', status: 'completed', user_id: 2 },
                { title: 'Clean room', description: 'Vacuum and dust', status: 'pending', user_id: 2 },
                { title: 'Update resume', description: 'Add recent projects', status: 'in_progress', user_id: 2 },

                // { title: 'Review team tasks', description: 'Check progress', status: 'pending', user_id: 3 },
                // { title: 'Schedule meeting', description: 'Team sync next week', status: 'in_progress', user_id: 3 },
                // { title: 'Approve budget', description: 'Q2 expenses', status: 'completed', user_id: 3 },
                // { title: 'Update policies', description: 'New security rules', status: 'pending', user_id: 3 },
                // { title: 'Deploy app', description: 'Release v1.2', status: 'in_progress', user_id: 3 },
            ];

            for (const task of tasks) {
                await pool.query(`
                    INSERT INTO tasks (title, description, status, user_id)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT DO NOTHING;
                `, [task.title, task.description, task.status, task.user_id]);
            }
            console.log('Initial tasks added');
        }

    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

const connectDB = async () => {
    try {
      await pool.connect();
      console.log('PostgreSQL connected');

      await initializeDatabase();
  
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  };

module.exports = { pool, connectDB };