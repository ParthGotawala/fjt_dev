const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GroupParticipantDetails = sequelize.define('GroupParticipantDetails', {
        groupParticipantID: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        groupID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        participantID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        participantAddedBy: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        participantRemovedBy: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        },
        isRead: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        lastReadAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'group_participant_details'
    });

    GroupParticipantDetails.associate = (models) => {
        GroupParticipantDetails.belongsTo(models.GroupChat, {
            foreignKey: 'groupID',
            as: 'groupChat'
        });
        GroupParticipantDetails.belongsTo(models.User, {
            foreignKey: 'participantID',
            as: 'user'
        });
    };

    return GroupParticipantDetails;
};