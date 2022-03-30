const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransOperationHoldUnhold = sequelize.define('WorkorderTransOperationHoldUnhold', {
        woTransOpHoldUnholdId: {
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
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        reason: {
            type: Sequelize.STRING(500),
            allowNull: false
        },
        resumeReason: {
            type: Sequelize.STRING(500),
            allowNull: true
        },
        holdEmployeeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        unHoldEmployeeId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING(255),
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
        tableName: 'workorder_trans_operation_hold_unhold'
    });

    WorkorderTransOperationHoldUnhold.associate = (models) => {
        WorkorderTransOperationHoldUnhold.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransOperationHoldUnhold.belongsTo(models.Operation, {
            as: 'operations',
            foreignKey: 'opID'
        });
        WorkorderTransOperationHoldUnhold.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        WorkorderTransOperationHoldUnhold.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'woTransID'
        });
        WorkorderTransOperationHoldUnhold.belongsTo(models.Employee, {
            as: 'holdEmployees',
            foreignKey: 'holdEmployeeId'
        });
        WorkorderTransOperationHoldUnhold.belongsTo(models.Employee, {
            as: 'unHoldEmployees',
            foreignKey: 'unHoldEmployeeId'
        });
    };

    return WorkorderTransOperationHoldUnhold;
};