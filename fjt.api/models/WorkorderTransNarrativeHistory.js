const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransNarrativeHistory = sequelize.define('WorkorderTransNarrativeHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        narrativeDescription: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        totalTimeConsume: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        entryDate: {
            type: Sequelize.DATE,
            allowNull: false
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
        tableName: 'workorder_trans_narrative_history'
    });

    WorkorderTransNarrativeHistory.associate = (models) => {
        WorkorderTransNarrativeHistory.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
        WorkorderTransNarrativeHistory.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransNarrativeHistory.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        WorkorderTransNarrativeHistory.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        WorkorderTransNarrativeHistory.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'woTransID'
        });
    };

    return WorkorderTransNarrativeHistory;
};