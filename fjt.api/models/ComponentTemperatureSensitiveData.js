const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentTemperatureSensitiveData = sequelize.define('ComponentTemperatureSensitiveData', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        pickTemperatureAbove: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        timeLiquidusSecond: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
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
    },
        {
            paranoid: true,
            tableName: 'component_temperature_sensitive_data'
        });

    ComponentTemperatureSensitiveData.associate = (models) => {
        ComponentTemperatureSensitiveData.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
    };

    return ComponentTemperatureSensitiveData;
};