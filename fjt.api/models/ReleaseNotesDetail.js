const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReleaseNoteDetail = sequelize.define('ReleaseNoteDetail', {
        Id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        releasedID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        notes: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'release_notes_detail'
        });

    ReleaseNoteDetail.associate = (models) => {
        ReleaseNoteDetail.belongsTo(models.ReleaseNotes, {
            as: 'ReleaseNotes',
            foreignKey: 'releasedID'
        });
    };
    return ReleaseNoteDetail;
};