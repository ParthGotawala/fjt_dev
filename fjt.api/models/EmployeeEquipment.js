const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EmployeeEquipment = sequelize.define('EmployeeEquipment', {
        empEqpID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        eqpID: {
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
        }
    }, {
        paranoid: true,
        tableName: 'employee_equipment'
    });

    EmployeeEquipment.associate = (models) => {
        EmployeeEquipment.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'eqpID'
        });
        EmployeeEquipment.belongsTo(models.Employee, {
            as: 'Employee',
            foreignKey: 'employeeID'
        });
    };

    return EmployeeEquipment;
};