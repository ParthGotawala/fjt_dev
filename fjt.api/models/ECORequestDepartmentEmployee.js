const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ECORequestDepartmentEmployee = sequelize.define('ECORequestDepartmentEmployee', {
        ecoDeptDetailID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ecoDeptApprovalID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        employeeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        initiateDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isAck: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
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
        }
    },
        {
            paranoid: true,
            tableName: 'eco_request_department_employee'
        });

    ECORequestDepartmentEmployee.associate = (models) => {
        ECORequestDepartmentEmployee.belongsTo(models.ECORequestDepartmentApproval, {
            as: 'eco_request_department_approval',
            foreignKey: 'ecoDeptApprovalID'
        });
        ECORequestDepartmentEmployee.belongsTo(models.Employee, {
            as: 'employees',
            foreignKey: 'employeeID'
        });
    };

    return ECORequestDepartmentEmployee;
};