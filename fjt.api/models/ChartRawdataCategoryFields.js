const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartRawdataCategoryFields = sequelize.define('ChartRawdataCategoryFields', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        chartRawdataCatID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        field: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        displayName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        aggregate: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dataType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isSystemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    },
        {
            paranoid: true,
            tableName: 'chart_rawdata_category_fields'
        });

    ChartRawdataCategoryFields.associate = (models) => {
        ChartRawdataCategoryFields.belongsTo(models.ChartRawdataCategory, {
            foreignKey: 'chartRawdataCatID',
            as: 'chartRawdataCategory'
        });
    };

    return ChartRawdataCategoryFields;
};