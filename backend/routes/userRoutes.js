const express = require('express');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/role');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.use(auth);
router.use(admin);

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;