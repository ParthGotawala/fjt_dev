const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ECORequestDepartmentApproval = sequelize.define('ECORequestDepartmentApproval', {
        ecoDeptApprovalID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ecoReqID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        deptID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        initiateDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isAck: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 1000]
            }
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
            tableName: 'eco_request_department_approval'
        });

    ECORequestDepartmentApproval.associate = (models) => {
        ECORequestDepartmentApproval.belongsTo(models.ECORequest, {
            as: 'ecoRequest',
            foreignKey: 'ecoReqID'
        });
        ECORequestDepartmentApproval.belongsTo(models.EmployeeDepartment, {
            as: 'ecoDepartment',
            foreignKey: 'deptID'
        });
        ECORequestDepartmentApproval.belongsTo(models.Employee, {
            as: 'ecoEmployee',
            foreignKey: 'employeeID'
        });
        ECORequestDepartmentApproval.hasMany(models.ECORequestDepartmentEmployee, {
            as: 'eco_request_department_employee',
            foreignKey: 'ecoDeptApprovalID'
        });
    };

    return ECORequestDepartmentApproval;
};