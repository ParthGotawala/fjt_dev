const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DynamicReportFields = sequelize.define('DynamicReportFields', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        dynamicReportID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        Fields: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
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
        },
        orderBy: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        createByRoleId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        deleteByRoleId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        updateByRoleId: {
            allowNull: true,
            type: Sequelize.INTEGER
        }
    },
    {
        paranoid: true,
        tableName: 'dynamicreportfields'
    });
    return DynamicReportFields;
};