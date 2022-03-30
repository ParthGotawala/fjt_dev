const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DynamicReportMst = sequelize.define('DynamicReportMst', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ReportName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        Filter: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        ReportType: {
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
        chartRawDataCatID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        pivotJsonData: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        chartCategoryID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        isPinToDashboard: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'dynamicreportmst'
        });

    DynamicReportMst.associate = (models) => {
        DynamicReportMst.hasMany(models.DynamicReportAccess, {
            foreignKey: 'refTransID',
            as: 'dynamicReportAccess'
        });
        DynamicReportMst.hasMany(models.DynamicReportFields, {
            foreignKey: 'dynamicReportID',
            as: 'dynamicReportFields'
        });
        DynamicReportMst.belongsTo(models.ChartRawdataCategory, {
            foreignKey: 'chartRawDataCatID',
            as: 'chartRawdataCategory'
        });
        DynamicReportMst.belongsTo(models.ChartCategory, {
            foreignKey: 'chartCategoryID',
            as: 'chartCategory'
        });
        DynamicReportMst.belongsTo(models.User, {
            foreignKey: 'createdBy',
            as: 'user'
        });
    };

    return DynamicReportMst;
};