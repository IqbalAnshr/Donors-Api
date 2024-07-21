// controllers/chatController.js
const chatService = require('../services/chatService');
const socketService = require('../services/socketService');


const createChat = async (req, res) => {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;
    try {
        const chat = await chatService.createChat(senderId, receiverId, message);
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllChats = async (req, res) => {
    try {
        const chats = await chatService.getAllChats();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getChatsByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const chats = await chatService.getChatsByUser(userId);
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsersChattedWith = async (req, res) => {
    const userId = req.user.id;
    const search = req.query.search;
    console.log(search)
    try {
        const usersChattedWith = await chatService.getUsersChattedWith(userId, search);
        res.status(200).json(usersChattedWith);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getChatsBetweenUsers = async (req, res) => {
    const userId1 = req.user.id;
    const { userId2 } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const chats = await chatService.getChatsBetweenUsers(userId1, userId2, parseInt(page), parseInt(limit));
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOnlineUsers = async (req, res) => {
    try {
        const onlineUsers = await socketService.getOnlineUsers();
        res.status(200).json(onlineUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createChat,
    getAllChats,
    getChatsByUser,
    getUsersChattedWith,
    getChatsBetweenUsers,
    getOnlineUsers
};
