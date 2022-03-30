const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DynamicReportAccess = sequelize.define('DynamicReportAccess', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refTableName: {
            allowNull: false,
            type: Sequelize.STRING
        },
        refTransID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        EmployeeID: {
            allowNull: false,
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
        entityPermission: {
            allowNull: false,
            type: Sequelize.STRING
        }
    },
    {
        paranoid: true,
        tableName: 'dynamicreportaccess'
    });
    return DynamicReportAccess;
};