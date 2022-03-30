const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartRawdataCategory = sequelize.define('ChartRawdataCategory', {
        chartRawDataCatID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        dbViewName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
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
        }
    },
        {
            paranoid: true,
            tableName: 'chart_rawdata_category'
        });

    ChartRawdataCategory.associate = (models) => {
        ChartRawdataCategory.hasMany(models.ChartRawdataCategoryFields, {
            foreignKey: 'chartRawdataCatID',
            as: 'chartRawdataCategoryFields'
        });
    };

    return ChartRawdataCategory;
};