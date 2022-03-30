const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransfer = sequelize.define('WorkorderTransfer', {
        woTransID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fromWOID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fromOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fromWOOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        toWOID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        toOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        toWOOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        transferDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        transferQty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
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
    }, {
        paranoid: true,
        tableName: 'workorder_transfer'
    });

    WorkorderTransfer.associate = (models) => {
        WorkorderTransfer.belongsTo(models.Workorder, {
            as: 'fromWorkorder',
            foreignKey: 'fromWOID'
        });
        WorkorderTransfer.belongsTo(models.Operation, {
            as: 'fromOperation',
            foreignKey: 'fromOPID'
        });
        WorkorderTransfer.belongsTo(models.WorkorderOperation, {
            as: 'fromWorkorderOperation',
            foreignKey: 'fromWOOPID'
        });
        WorkorderTransfer.belongsTo(models.Workorder, {
            as: 'toWorkorder',
            foreignKey: 'toWOID'
        });
        WorkorderTransfer.belongsTo(models.Operation, {
            as: 'toOperation',
            foreignKey: 'toOPID'
        });
        WorkorderTransfer.belongsTo(models.WorkorderOperation, {
            as: 'toWorkorderOperation',
            foreignKey: 'toWOOPID'
        });
    };

    return WorkorderTransfer;
};