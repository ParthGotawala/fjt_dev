const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReportMasterParameter = sequelize.define('ReportMasterParameter', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        reportId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parmeterMappingid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isRequired: {
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
        tableName: 'reportmasterparameter',
        paranoid: true
    });
    ReportMasterParameter.associate = (models) => {
        ReportMasterParameter.belongsTo(models.ReportMaster, {
            foreignKey: 'reportId',
            as: 'ReportMaster'
        });
        ReportMasterParameter.belongsTo(models.ReportParameterSettingMapping, {
            foreignKey: 'parmeterMappingid',
            as: 'ReportParameterSettingMapping'
        });
    };
    return ReportMasterParameter;
};
