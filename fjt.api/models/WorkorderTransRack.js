const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransRack = sequelize.define('WorkorderTransRack', {
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
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        transactionType: {
            type: Sequelize.STRING,
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
            tableName: 'workorder_trans_rack',
            paranoid: true
        });

    WorkorderTransRack.associate = (models) => {
        WorkorderTransRack.belongsTo(models.RackMst, {
            foreignKey: 'rackID',
            as: 'rackMst'
        });
        WorkorderTransRack.belongsTo(models.WorkorderTrans, {
            foreignKey: 'woTransID',
            as: 'workorderTrans'
        });
        WorkorderTransRack.belongsTo(models.WorkorderOperation, {
            foreignKey: 'woOPID',
            as: 'workorderOperation'
        });
        WorkorderTransRack.belongsTo(models.Employee, {
            foreignKey: 'employeeID',
            as: 'employee'
        });
    };

    return WorkorderTransRack;
};
