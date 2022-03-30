const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentROHSAlternatePN = sequelize.define('ComponentROHSAlternatePN', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        aliasgroupID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        componentID: {
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
        tableName: 'component_rohsalternatepn'
    });

    ComponentROHSAlternatePN.associate = (models) => {
        ComponentROHSAlternatePN.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'componentID'
        });
    };

    return ComponentROHSAlternatePN;
};
