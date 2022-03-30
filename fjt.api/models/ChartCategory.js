const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartCategory = sequelize.define('ChartCategory', {
        id: {
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
                len: [1, 255]
            }
        },
        order: {
            type: Sequelize.DECIMAL(10, 5),
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
        }
    },
        {
            paranoid: true,
            tableName: 'chart_category'
        });

    ChartCategory.associate = (models) => {
        ChartCategory.hasMany(models.ChartTemplateMst, {
            foreignKey: 'chartCategoryID',
            as: 'chartTemplateMst'
        });
    };

    return ChartCategory;
};