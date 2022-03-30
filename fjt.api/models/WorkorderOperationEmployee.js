const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationEmployee = sequelize.define('WorkorderOperationEmployee', {
        woOpEmployeeID: {
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
        employeeID: {
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
        tableName: 'workorder_operation_employee'
    });

    WorkorderOperationEmployee.associate = (models) => {
        WorkorderOperationEmployee.belongsToMany(models.Operation, {
            as: 'operation',
            through: 'operations',
            foreignKey: 'opID'
        });
        WorkorderOperationEmployee.belongsTo(models.Operation, {
            as: 'operation_workorder',
            foreignKey: 'opID'
        });
        WorkorderOperationEmployee.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderOperationEmployee.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        WorkorderOperationEmployee.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        // WorkorderOperationEmployee.belongsToMany(models.Workorder, {
        //     as: 'workorderOperationEmployee',
        //     through: 'Workorder_employee',
        //     foreignKey: 'woID',
        // });
    };

    return WorkorderOperationEmployee;
};
