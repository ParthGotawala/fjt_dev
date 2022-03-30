const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GroupChat = sequelize.define('GroupChat', {
        groupID: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        groupName: {
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
    }, {
        paranoid: true,
        tableName: 'group_chat'
    });

    GroupChat.associate = (models) => {
        // GroupChat.hasMany(models.GroupChatLog, {
        //    foreignKey: 'groupID',
        //    as: 'groupChatLog'
        // });
        GroupChat.hasMany(models.GroupParticipantDetails, {
            foreignKey: 'groupID',
            as: 'groupParticipantDetails'
        });
    };

    return GroupChat;
};
