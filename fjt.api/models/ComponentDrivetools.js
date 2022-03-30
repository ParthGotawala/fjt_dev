const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentDrivetools = sequelize.define('ComponentDrivetools', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refComponentID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        componentID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        }
    }, {
        paranoid: true,
        tableName: 'component_drivetools'
    });

    ComponentDrivetools.associate = (models) => {
        ComponentDrivetools.belongsTo(models.Component, {
            as: 'refComponent',
            foreignKey: 'refComponentID'
        });
        ComponentDrivetools.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'componentID'
        });
    };

    return ComponentDrivetools;
};