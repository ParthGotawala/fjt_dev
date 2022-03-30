/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentFunctionalTestingEquipment = sequelize.define('ComponentFunctionalTestingEquipment', {
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
        eqpID: {
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
        tableName: 'component_functionaltestingequipment'
    });

    ComponentFunctionalTestingEquipment.associate = (models) => {
        ComponentFunctionalTestingEquipment.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'eqpID'
        });

        ComponentFunctionalTestingEquipment.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
    };
    return ComponentFunctionalTestingEquipment;
};