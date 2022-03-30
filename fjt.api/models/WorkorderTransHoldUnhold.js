const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransHoldUnhold = sequelize.define('WorkorderTransHoldUnhold', {
        woTransHoldUnholdId: {
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
        tableName: 'workorder_trans_hold_unhold'
    });

    WorkorderTransHoldUnhold.associate = (models) => {
        WorkorderTransHoldUnhold.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransHoldUnhold.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'woTransID'
        });
        WorkorderTransHoldUnhold.belongsTo(models.Employee, {
            as: 'holdEmployees',
            foreignKey: 'holdEmployeeId'
        });
        WorkorderTransHoldUnhold.belongsTo(models.Employee, {
            as: 'unHoldEmployees',
            foreignKey: 'unHoldEmployeeId'
        });
    };

    return WorkorderTransHoldUnhold;
};