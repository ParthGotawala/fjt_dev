const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ChartRawdataCategoryAccessRole = sequelize.define('ChartRawdataCategoryAccessRole', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        chartRawDataCatID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        roleID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
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
        }
    },
        {
            tableName: 'chart_rawdata_category_access_role',
            paranoid: true
        });

    ChartRawdataCategoryAccessRole.associate = (models) => {
        // ChartRawdataCategoryAccessRole.belongsTo(models.Role, {
        //    as: 'role',
        //    foreignKey: 'roleID'
        // });
        // ChartRawdataCategoryAccessRole.belongsTo(models.ChartRawdataCategory, {
        //    as: 'chart_Rawdata_Category',
        //    foreignKey: 'chartRawDataCatID'
        // });
    };

    return ChartRawdataCategoryAccessRole;
};