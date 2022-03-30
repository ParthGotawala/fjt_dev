const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartTypeMst = sequelize.define('ChartTypeMst', {
        chartTypeID: {
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
                len: [1, 64]
            }
        },
        iconClass: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
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
            tableName: 'chart_typemst'
        });

    ChartTypeMst.associate = (models) => {
        ChartTypeMst.hasMany(models.ChartTemplateMst, {
            foreignKey: 'chartTypeID',
            as: 'chartTemplateMst'
        });
    };

    return ChartTypeMst;
};