const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentAlternatePN = sequelize.define('ComponentAlternatePN', {

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
        type: {
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
        tableName: 'component_alternatepn'
    });

    ComponentAlternatePN.associate = (models) => {
        ComponentAlternatePN.belongsTo(models.Component, {
            as: 'alternateComponent',
            foreignKey: 'componentID'
        });

        ComponentAlternatePN.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
    };

    return ComponentAlternatePN;
};
