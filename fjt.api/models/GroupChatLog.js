const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GroupChatLog = sequelize.define('GroupChatLog', {
        groupChatID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        groupID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        senderID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        message: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mediaPath: {
            type: Sequelize.STRING,
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
        chatDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        // S = Special message which we display in center for add/remove members and other messages
        // M = Normal message into group
        remarkFlag: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 2]
            }
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'group_chat_log'
        });

    GroupChatLog.associate = (models) => {
        GroupChatLog.belongsTo(models.GroupChat, {
            as: 'group_chat',
            foreignKey: 'groupID'
        });
        GroupChatLog.belongsTo(models.User, {
            foreignKey: 'senderID',
            as: 'senderUser'
        });
    };

    return GroupChatLog;
};