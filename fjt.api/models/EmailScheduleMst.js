/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EmailScheduleMst = sequelize.define('EmailScheduleMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        reportID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        entity: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        schedule: {
            type: Sequelize.INTEGER,
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
        lastEmailSendDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        IsActive: {
            type: Sequelize.BOOLEAN,
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
    },
        {
            tableName: 'email_schedulemst',
            paranoid: true
        });

    EmailScheduleMst.associate = (models) => {
        EmailScheduleMst.belongsTo(models.ReportMaster, {
            foreignKey: 'reportID',
            as: 'ReportMaster'
        });
        EmailScheduleMst.belongsTo(models.MfgCodeMst, {
            foreignKey: 'customerID',
            as: 'mfgCodeMst'
        });
        EmailScheduleMst.hasMany(models.EmailAddressDetail, {
            foreignKey: 'refID',
            as: 'EmailAddressDetail'
        });
    };

    return EmailScheduleMst;
};
