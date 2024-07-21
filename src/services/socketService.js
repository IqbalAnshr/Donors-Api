// services/socketService.js
const chatService = require('./chatService');
const authMiddleware = require("../middlewares/authMiddleware");
const db = require('../database/models');

let onlineUsers = [];

const getOnlineUsers = (req, res) => {
    return { onlineUsers }
};

const initializeSocket = (io) => {

    io.use(authMiddleware.socketAuthentication);

    io.on('connection', (socket) => {
        console.log('New client connected ' + socket.id);

        const userId = socket.user.id

        socket.on('online', () => {
            !onlineUsers.find(user => user.userId == userId && user.socketId == socket.id) &&
            onlineUsers.push({ userId, socketId: socket.id });
            io.emit('online', onlineUsers);
            console.log('onlineUsers', onlineUsers);
        });

        socket.on('message', async (message) => {
            console.log('Received message:', message);

            if (!message.receiverId || !message.content) {
                console.log('Invalid message:', message);
                return;
            }

            const receiver = onlineUsers.find(user => user.userId == message.receiverId);

            try {
                // Save the chat message to the database
                const chat = await chatService.createChat(userId, message.receiverId, message.content);
                const user = await db.User.findByPk(message.receiverId);
                if (!user) {
                    throw new Error('User not found');
                }
                const name = user.name;

                console.log('Chat saved from ' + userId + ' successfully:', chat.dataValues.message);

                const chatlist = {
                    user: { 
                        id: message.receiverId,
                        name: name,
                    },
                    authId: userId,
                    senderId: userId,
                    lastMessage: message.content,
                    createdAt: new Date().toISOString()
                };

                console.log(chatlist)

                // If the receiver is online, emit the message and chatlist to them
                if (receiver) {
                    // io.to(receiver.socketId).emit('message', message);
                    io.to(receiver.socketId).emit('chatlist', chatlist);
                }

            } catch (error) {
                console.error('Error saving chat:', error);
                socket.emit('error', 'Failed to save chat');
            }
        });

        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
            io.emit('online', onlineUsers);
            console.log('Client ' + socket.id + ' disconnected');
        });
    });
};

module.exports = { getOnlineUsers, initializeSocket };
