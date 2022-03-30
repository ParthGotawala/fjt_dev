
/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EmailAddressDetail = sequelize.define('EmailAddressDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refEmailID: {
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
        }
    },
        {
            tableName: 'email_addressdetail',
            paranoid: true
        });

    EmailAddressDetail.associate = (models) => {
        EmailAddressDetail.belongsTo(models.EmailScheduleMst, {
            foreignKey: 'refID',
            as: 'EmailScheduleMst'
        });
        EmailAddressDetail.belongsTo(models.ContactPerson, {
            foreignKey: 'refEmailID',
            as: 'contactPerson'
        });
    };

    return EmailAddressDetail;
};
