const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartTemplateMst = sequelize.define('ChartTemplateMst', {
        chartTemplateID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        chartTypeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        nameOfChart: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        xAxisVal: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        yAxisVal: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
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
        chartRawDataCatID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        filterData: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        xAxisName: {
            allowNull: true,
            type: Sequelize.STRING(100)
        },
        yAxisName: {
            allowNull: true,
            type: Sequelize.STRING(100)
        },
        chartCatID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        compareVariables: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        drilldown: {
            allowNull: true,
            type: Sequelize.STRING(1000)
        },
        xAxisFormat: {
            allowNull: true,
            type: Sequelize.STRING(50)
        },
        isPinToDashboard: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isPinToTraveler: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isRenderTable: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        chartCategoryID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        isSystemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        dataRefreshTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'chart_templatemst'
        });

    ChartTemplateMst.associate = (models) => {
        ChartTemplateMst.belongsTo(models.ChartTypeMst, {
            foreignKey: 'chartTypeID',
            as: 'chartTypeMst'
        });
        ChartTemplateMst.belongsTo(models.ChartRawdataCategory, {
            foreignKey: 'chartRawDataCatID',
            as: 'chartRawdataCategory'
        });
        ChartTemplateMst.belongsTo(models.ChartCategory, {
            foreignKey: 'chartCategoryID',
            as: 'chartCategory'
        });
        ChartTemplateMst.hasMany(models.ChartTemplateOperations, {
            foreignKey: 'chartTemplateID',
            as: 'chartTemplateOperations'
        });
        ChartTemplateMst.hasMany(models.ChartTemplateAccess, {
            foreignKey: 'chartTemplateID',
            as: 'chartTemplateAccess'
        });
        ChartTemplateMst.belongsTo(models.User, {
            foreignKey: 'createdBy',
            as: 'user'
        });
    };

    return ChartTemplateMst;
};