const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReportParameterSettingMapping = sequelize.define('ReportParameterSettingMapping', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        reportParamName: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        dbColumnName: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        displayName: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        pageRouteState: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        dataSourceId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isHiddenParameter: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        options: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        isDisplay: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        displayOrder: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 2)
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
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'report_parameter_setting_mapping',
        paranoid: true
    });
    ReportParameterSettingMapping.associate = (models) => {
        ReportParameterSettingMapping.belongsTo(models.FixedEntityDataelement, {
            foreignKey: 'dataSourceId',
            as: 'FixedEntityDataelement'
        });
        ReportParameterSettingMapping.hasMany(models.ReportMasterParameter, {
            foreignKey: 'parmeterMappingid',
            as: 'reportMasterParameters'
        });
    };

    return ReportParameterSettingMapping;
};
