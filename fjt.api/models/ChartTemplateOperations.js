const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartTemplateOperations = sequelize.define('ChartTemplateOperations', {
        chartTempOPID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        chartTemplateID: {
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
        }
    },
        {
            paranoid: true,
            tableName: 'chart_template_operations'
        });

    ChartTemplateOperations.associate = (models) => {
        ChartTemplateOperations.belongsTo(models.ChartTemplateMst, {
            foreignKey: 'chartTemplateID',
            as: 'chartTemplateMst'
        });
        ChartTemplateOperations.belongsTo(models.Operation, {
            foreignKey: 'opID',
            as: 'operations'
        });
    };

    return ChartTemplateOperations;
};