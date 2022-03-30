var Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EmployeeDepartment = sequelize.define('EmployeeDepartment', {
        empDeptID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        departmentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        titleID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
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
        isDefault: {
            type: Sequelize.BOOLEAN
            // allowNull: false
        }
        // roleID:{
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        // },
    }, {
        tableName: 'employee_department',
        paranoid: true
    });

    EmployeeDepartment.associate = (models) => {
        EmployeeDepartment.belongsTo(models.Employee, {
            foreignKey: 'employeeID',
            as: 'employee'
        });
        EmployeeDepartment.belongsTo(models.GenericCategory, {
            foreignKey: 'titleID',
            as: 'genericCategory'
        });
        EmployeeDepartment.belongsTo(models.Department, {
            foreignKey: 'departmentID',
            as: 'department'
        });
    };

    return EmployeeDepartment;
};

