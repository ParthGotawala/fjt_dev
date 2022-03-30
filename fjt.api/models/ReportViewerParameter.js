const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReportViewerParameter = sequelize.define('ReportViewerParameter', {
        parameterGUID: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
        },
        reportId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        reportName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        parameterValues: {
            type: Sequelize.STRING,
            allowNull: false
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
        tableName: 'reportviewerparameter',
        paranoid: true
    });
    ReportViewerParameter.associate = (models) => {
        ReportViewerParameter.belongsTo(models.ReportMaster, {
            foreignKey: 'reportId',
            as: 'ReportMaster'
        });
    };
    return ReportViewerParameter;
};
