const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Chat = sequelize.define('Chat', {
        chatID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        senderID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        receiverID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        message: {
            type: Sequelize.STRING,
            allowNull: true
        },
        chatDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isRead: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mediaPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDownloaded: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        fileUploadStatus: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        displayFileName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'chat'
        });

    Chat.associate = (models) => {
        Chat.belongsTo(models.User, {
            foreignKey: 'senderID',
            as: 'senderUser'
        });
        Chat.belongsTo(models.User, {
            foreignKey: 'receiverID',
            as: 'receiverUser'
        });
    };
    return Chat;
};