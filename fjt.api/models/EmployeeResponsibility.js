const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EmployeeResponsibility = sequelize.define('EmployeeResponsibility', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        responsibilityID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
    },
        {
            paranoid: true,
            tableName: 'employee_responsibility'
        });

    EmployeeResponsibility.associate = (models) => {
        EmployeeResponsibility.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        EmployeeResponsibility.belongsTo(models.GenericCategory, {
            as: 'responsibility',
            foreignKey: 'responsibilityID'
        });
    };

    return EmployeeResponsibility;
};