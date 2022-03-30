const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReleaseNotes = sequelize.define('ReleaseNotes', {
        Id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        releasedDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        version: {
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
    }, {
        tableName: 'release_notes',
        paranoid: true
    });

    ReleaseNotes.associate = (models) => {
        ReleaseNotes.hasMany(models.ReleaseNoteDetail, {
            foreignKey: 'releasedID',
            as: 'ReleaseNoteDetail'
        });
    };
    return ReleaseNotes;
};