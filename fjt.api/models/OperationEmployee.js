const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const OperationEmployee = sequelize.define('OperationEmployee', {
        opEmployeeID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
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
        }
    }, {
        paranoid: true,
        tableName: 'operation_employee'
    });

    OperationEmployee.associate = (models) => {
        OperationEmployee.belongsTo(models.Operation, {
            as: 'Operations',
            foreignKey: 'opID'
        });
        OperationEmployee.belongsTo(models.Employee, {
            as: 'Employee',
            foreignKey: 'employeeID'
        });
        // OperationEmployee.belongsToMany(models.Operation, {
        //    as: 'Operations',
        //    through: 'operationEmployee',
        //    foreignKey: 'opID',
        // })
    };

    return OperationEmployee;
};
