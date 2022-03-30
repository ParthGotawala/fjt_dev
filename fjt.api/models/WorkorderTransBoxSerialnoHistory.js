const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransBoxSerialnoHistory = sequelize.define('WorkorderTransBoxSerialnoHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woBoxSerialID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        serialID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        actionDetail: {
            type: Sequelize.INTEGER(1),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        tableName: 'workorder_trans_boxserialno_history'
    });

    WorkorderTransBoxSerialnoHistory.associate = (models) => {
        WorkorderTransBoxSerialnoHistory.belongsTo(models.WorkorderBoxSerialno, {
            as: 'workorderserialno',
            foreignKey: 'woBoxSerialID'
        });
        WorkorderTransBoxSerialnoHistory.belongsTo(models.WorkorderSerialMst, {
            as: 'workorderserialmst',
            foreignKey: 'serialID'
        });
        WorkorderTransBoxSerialnoHistory.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
    };

    return WorkorderTransBoxSerialnoHistory;
};