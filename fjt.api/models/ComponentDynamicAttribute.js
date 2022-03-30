const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentDynamicAttribute = sequelize.define('ComponentDynamicAttribute', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        attributeName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        fieldType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        icon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        defaultValue: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
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
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        }
    },
        {
            tableName: 'component_dynamic_attribute',
            paranoid: true
        });

    return ComponentDynamicAttribute;
};
