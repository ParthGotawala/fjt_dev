const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReportChangeLogs = sequelize.define('ReportChangeLogs', {
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
        startActivityDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        endActivityDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        activityStartBy: {
            type: Sequelize.INTEGER,
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
        tableName: 'report_change_logs',
        paranoid: true
    });

    ReportChangeLogs.associate = (models) => {
        ReportChangeLogs.belongsTo(models.ReportMaster, {
            foreignKey: 'reportId',
            as: 'ReportMaster'
        });
        ReportChangeLogs.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'activityStartBy'
        });
    };

    return ReportChangeLogs;
};
