// models/Chat.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {});

    Chat.associate = function (models) {
        Chat.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' });
        Chat.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiverId' });
    };

    return Chat;
};