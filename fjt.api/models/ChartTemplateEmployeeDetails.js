const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartTemplateEmployeeDetails = sequelize.define('ChartTemplateEmployeeDetails', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        employeeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        chartTemplateID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        displayOrder: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 2)
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
    },
        {
            paranoid: true,
            tableName: 'chart_template_employee_details'
        });

    ChartTemplateEmployeeDetails.associate = (models) => {
        ChartTemplateEmployeeDetails.belongsTo(models.Employee, {
            foreignKey: 'employeeID',
            as: 'employee'
        });

        ChartTemplateEmployeeDetails.belongsTo(models.ChartTemplateMst, {
            foreignKey: 'chartTemplateID',
            as: 'chartTemplateMst'
        });
    };

    return ChartTemplateEmployeeDetails;
};