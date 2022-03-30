const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Department = sequelize.define('Department', {
        deptID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        deptName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        deptMngrID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        parentDeptID: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'department'
        });

    Department.associate = (models) => {
        Department.belongsTo(models.Employee, {
            foreignKey: 'deptMngrID',
            as: 'employee'
        });
        Department.belongsTo(models.Department, {
            foreignKey: 'parentDeptID',
            as: 'parentDepartment'
        });
        Department.hasMany(models.EmployeeDepartment, {
            foreignKey: 'departmentID',
            as: 'employeeDepartment'
        });
        Department.hasMany(models.Equipment, {
            foreignKey: 'departmentID',
            as: 'equipmentDepartment'
        });
    };

    return Department;
};