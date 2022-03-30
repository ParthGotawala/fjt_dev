const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const OperationMasterTemplates = sequelize.define('OperationMasterTemplates', {
        masterTemplateId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        operationId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        isDeleted: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isActive: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        }
    }, {
        paranoid: true,
        tableName: 'operation_master_templates'
    });

    OperationMasterTemplates.associate = (models) => {
        OperationMasterTemplates.hasMany(models.Operation, {
            foreignKey: 'opID',
            as: 'operations',
            sourceKey: 'operationId'
        });
        OperationMasterTemplates.belongsToMany(models.MasterTemplate, {
            as: 'masterTemplates',
            through: 'operation_master_templates',
            foreignKey: 'id'
        });
    };

    return OperationMasterTemplates;
};
