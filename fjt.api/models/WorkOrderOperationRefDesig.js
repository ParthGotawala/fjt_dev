const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationRefDesig = sequelize.define('WorkorderOperationRefDesig', {
        Id: {
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
        tableName: 'workorder_operation_refdesig'
    });

    WorkorderOperationRefDesig.associate = (models) => {
        WorkorderOperationRefDesig.belongsTo(models.Operation, {
            as: 'workorder_operation_refdesig_woID',
            foreignKey: 'woID'
        });
        WorkorderOperationRefDesig.belongsTo(models.Workorder, {
            as: 'workorder_operation_refdesig_opID',
            foreignKey: 'opID'
        });
        WorkorderOperationRefDesig.belongsTo(models.WorkorderOperation, {
            as: 'wokrorder_operation_refdesig_woOPID',
            foreignKey: 'woOPID'
        });
    };

    return WorkorderOperationRefDesig;
};
