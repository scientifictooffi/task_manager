const express = require('express');
const cors = require('cors');
const {errorHandler} = require('./middlewares/errorHandler');
const { connectDB } = require('./config/db');

require('dotenv').config({ path: './.env' });
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();