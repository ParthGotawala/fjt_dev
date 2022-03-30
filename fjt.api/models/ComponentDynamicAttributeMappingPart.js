const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentDynamicAttributeMappingPart = sequelize.define('ComponentDynamicAttributeMappingPart', {
        id: {
            allowNull: true,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        mfgPNID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        attributeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        attributeValue: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
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
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
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
        }
    },
        {
            tableName: 'component_dynamic_attribute_mapping_part',
            paranoid: true
        });

    ComponentDynamicAttributeMappingPart.associate = (models) => {
        ComponentDynamicAttributeMappingPart.belongsTo(models.Component, {
            foreignKey: 'mfgPNID',
            as: 'component'
        });
        ComponentDynamicAttributeMappingPart.belongsTo(models.ComponentDynamicAttribute, {
            foreignKey: 'attributeID',
            as: 'dynamicAttribute'
        });
    };

    return ComponentDynamicAttributeMappingPart;
};
