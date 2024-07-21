// routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();


// router.post('/', chatController.createChat);
// router.get('/', chatController.getAllChats);
// router.get('/user/:userId', chatController.getChatsByUser);
router.get('/', chatController.getUsersChattedWith);
router.get('/with/:userId2', chatController.getChatsBetweenUsers);
router.get('/online-users', chatController.getOnlineUsers);

module.exports = router;
