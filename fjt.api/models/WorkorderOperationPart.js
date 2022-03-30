const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationPart = sequelize.define('WorkorderOperationPart', {
        woOPPartID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qpa: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        uomID: {
            type: Sequelize.INTEGER,
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
        actualQpa: {
            type: Sequelize.DECIMAL,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_operation_part'
    });

    WorkorderOperationPart.associate = (models) => {
        WorkorderOperationPart.belongsTo(models.Operation, {
            as: 'workorder_operation_part_operation',
            foreignKey: 'opID'
        });
        WorkorderOperationPart.belongsTo(models.Workorder, {
            as: 'workorder_operation_part_workorder',
            foreignKey: 'woID'
        });
        WorkorderOperationPart.belongsTo(models.Component, {
            as: 'componentSupplyMaterial',
            foreignKey: 'partID'
        });
    };

    return WorkorderOperationPart;
};
