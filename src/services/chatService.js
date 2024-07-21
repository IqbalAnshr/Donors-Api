// services/chatService.js
const { Chat, User, Sequelize } = require('../database/models');
const Op = Sequelize.Op;


const createChat = async (senderId, receiverId, message) => {
    return await Chat.create({ senderId, receiverId, message });
};

const getAllChats = async () => {
    return await Chat.findAll({
        include: [
            { model: User, as: 'Sender', attributes: ['id', 'name'] },
            { model: User, as: 'Receiver', attributes: ['id', 'name'] },
        ],
        order: [['createdAt', 'ASC']],
    });
};

const getChatsByUser = async (userId) => {
    return await Chat.findAll({
        where: {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        },
        include: [
            { model: User, as: 'Sender', attributes: ['id', 'name'] },
            { model: User, as: 'Receiver', attributes: ['id', 'name'] },
        ],
        order: [['createdAt', 'ASC']],
    });
};

const getUsersChattedWith = async (userId, search = '') => {
    // Fetch distinct users who have chatted with the specified user
    search = search ? `%${search}%` : '%%';

    const chats = await Chat.findAll({
        where: {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        },
        include: [
            {
                model: User,
                as: 'Sender',
                attributes: ['id', 'name'],
                where: {
                    name: {
                        [Op.like]: search,
                    },
                },
                required: false,
            },
            {
                model: User,
                as: 'Receiver',
                attributes: ['id', 'name'],
                where: {
                    name: {
                        [Op.like]: search,
                    },
                },
                required: false,
            },
        ],
        order: [['createdAt', 'ASC']],
    });

    // Object to hold unique users with their last messages
    const usersWithLastMessage = {};

    chats.forEach(chat => {
        // Add sender if not the specified user
        if (chat.senderId != userId && chat.Sender) {
            if (!usersWithLastMessage[chat.senderId] || new Date(chat.createdAt) > new Date(usersWithLastMessage[chat.senderId].createdAt)) {
                usersWithLastMessage[chat.senderId] = {
                    user: chat.Sender,
                    authId : userId,
                    senderId : chat.senderId,
                    lastMessage: chat.message,
                    createdAt: chat.createdAt,
                };
            }
        }
        // Add receiver if not the specified user
        if (chat.receiverId != userId && chat.Receiver) {
            if (!usersWithLastMessage[chat.receiverId] || new Date(chat.createdAt) > new Date(usersWithLastMessage[chat.receiverId].createdAt)) {
                usersWithLastMessage[chat.receiverId] = {
                    user: chat.Receiver,
                    authId : userId,
                    senderId : chat.senderId,
                    lastMessage: chat.message,
                    createdAt: chat.createdAt,
                };
            }
        }
    });

    // Convert the object to an array and sort by the last message timestamp
    const uniqueUsersWithLastMessages = Object.values(usersWithLastMessage).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Return the unique users and their last message
    return uniqueUsersWithLastMessages;
};


const getChatsBetweenUsers = async (userId1, userId2, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const chats = await Chat.findAndCountAll({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [{ senderId: userId1 }, { receiverId: userId2 }],
                },
                {
                    [Op.and]: [{ senderId: userId2 }, { receiverId: userId1 }],
                },
            ],
        },
        include: [
            { model: User, as: 'Sender', attributes: ['id', 'name'] },
            { model: User, as: 'Receiver', attributes: ['id', 'name'] },
        ],
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset,
    });

    return {
        authId: userId1,
        totalItems: chats.count,
        totalPages: Math.ceil(chats.count / limit),
        currentPage: parseInt(page, 10),
        data: chats.rows,
    };
};

module.exports = {
    createChat,
    getAllChats,
    getChatsByUser,
    getUsersChattedWith,
    getChatsBetweenUsers,
};
