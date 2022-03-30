const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentDataSheets = sequelize.define('ComponentDataSheets', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        datasheetURL: {
            type: Sequelize.STRING,
            allowNull: false
        },
        refComponentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        datasheetName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDownloadCompleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'component_datasheets'
    });

    ComponentDataSheets.associate = (models) => {
        ComponentDataSheets.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
    };

    return ComponentDataSheets;
};