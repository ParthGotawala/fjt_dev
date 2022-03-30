const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationEquipment = sequelize.define('WorkorderOperationEquipment', {
        woOpEqpID: {
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
        eqpID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isOnline: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        tableName: 'workorder_operation_equipment'
    });

    WorkorderOperationEquipment.associate = (models) => {
        WorkorderOperationEquipment.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'opID'
        });
        WorkorderOperationEquipment.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        WorkorderOperationEquipment.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderOperationEquipment.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'eqpID'
        });
        WorkorderOperationEquipment.belongsTo(models.WorkorderOperationEquipmentFeederDetails, {
            as: 'workorderOperationEquipmentFeederDet',
            foreignKey: 'woOpEqpID'
        });
    };

    return WorkorderOperationEquipment;
};
