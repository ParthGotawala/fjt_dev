
var Sequelize = require('sequelize');

/* eslint-disable global-require */
module.exports = (sequelize) => {
    const EmployeeMFGMapping = sequelize.define('EmployeeMFGMapping', {
        id: {
            allowNull: true,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        employeeId: {
            type: Sequelize.INTEGER
        },
        mfgCodeId: {
            type: Sequelize.INTEGER
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
            tableName: 'employee_mfg_mapping',
            paranoid: true
        });

    EmployeeMFGMapping.associate = (models) => {
        EmployeeMFGMapping.belongsTo(models.Employee, {
            foreignKey: 'employeeId',
            as: 'employee'
        });
        EmployeeMFGMapping.belongsTo(models.MfgCodeMst, {
            foreignKey: 'mfgCodeId',
            as: 'mfgCodeMst'
        });
    };

    return EmployeeMFGMapping;
};
