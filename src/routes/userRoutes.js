const express = require('express');
const { createUser, getUserById } = require('../controllers/userController');
const router = express.Router();

router.get('/:id', getUserById)
router.post('/create_user', createUser);

module.exports = router;
