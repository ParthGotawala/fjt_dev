const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentProcessMaterial = sequelize.define('ComponentProcessMaterial', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        componentID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        tableName: 'component_processmaterial'
    });

    ComponentProcessMaterial.associate = (models) => {
        ComponentProcessMaterial.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
        ComponentProcessMaterial.belongsTo(models.Component, {
            as: 'componentAsProcessMaterial',
            foreignKey: 'componentID'
        });
    };

    return ComponentProcessMaterial;
};