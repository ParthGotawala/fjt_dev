const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EmployeeContactPerson = sequelize.define('EmployeeContactPerson', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        employeeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        contactPersonId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        assignedAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        releasedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
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
        tableName: 'employee_contactperson'
    });

    EmployeeContactPerson.associate = (models) => {
        EmployeeContactPerson.belongsTo(models.ContactPerson, {
            foreignKey: 'contactPersonId',
            as: 'contactPerson'
        });
        EmployeeContactPerson.belongsTo(models.Employee, {
            foreignKey: 'employeeId',
            as: 'employee'
        });
    };
    return EmployeeContactPerson;
};