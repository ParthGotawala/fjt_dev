const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RackMstHistory = sequelize.define('RackMstHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rackID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rackName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        pidCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
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
            tableName: 'rackmst_history',
            paranoid: true
        });

    RackMstHistory.associate = (models) => {
        RackMstHistory.belongsTo(models.RackMst, {
            foreignKey: 'rackID',
            as: 'rackMst'
        });
        RackMstHistory.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'component'
        });
        RackMstHistory.belongsTo(models.Workorder, {
            foreignKey: 'woID',
            as: 'workorder'
        });
        RackMstHistory.belongsTo(models.Employee, {
            foreignKey: 'employeeID',
            as: 'employee'
        });
        RackMstHistory.belongsTo(models.WorkorderOperation, {
            foreignKey: 'woOPID',
            as: 'workorderOperation'
        });
        RackMstHistory.hasMany(models.RackmstHistoryStatusDetails, {
            foreignKey: 'rackHistoryID',
            as: 'rackmstHistoryStatusDetails'
        });
    };

    return RackMstHistory;
};
