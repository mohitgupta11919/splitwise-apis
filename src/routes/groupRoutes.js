const express = require('express');
const { createGroup, getGroupById, getGroupsByUserId, updateGroupMembers } = require('../controllers/groupController');
const router = express.Router();

router.post('/create_group', createGroup);
router.get('/:id', getGroupById)
router.get('/user/:id', getGroupsByUserId )
router.post('/update_group_members', updateGroupMembers)


module.exports = router;
