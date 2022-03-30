/* eslint-disable global-require */
module.exports = (sequelize) => {
    const Sequelize = require('sequelize');
    const DepartmentLocation = sequelize.define('DepartmentLocation', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        deptID: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        locationTypeID: {
            type: Sequelize.INTEGER,
            allowNUll: false
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        tableName: 'department_location',
        paranoid: true
    });

    DepartmentLocation.associate = (models) => {
        DepartmentLocation.belongsTo(models.Department, {
            foreignKey: 'deptID',
            as: 'department'
        });
        DepartmentLocation.belongsTo(models.GenericCategory, {
            foreignKey: 'locationTypeID',
            as: 'GenericCategory'
        });
    };

    return DepartmentLocation;
};