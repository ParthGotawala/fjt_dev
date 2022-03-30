const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartTemplateAccess = sequelize.define('ChartTemplateAccess', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        chartTemplateID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        employeeID: {
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
        }
    },
        {
            paranoid: true,
            tableName: 'chart_template_access'
        });
    return ChartTemplateAccess;
};