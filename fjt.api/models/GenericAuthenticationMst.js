const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GenericAuthenticationMst = sequelize.define('GenericAuthenticationMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        transactionType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        approveFromPage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refTableName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        refID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        confirmationType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        approvedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        approvalReason: {
            type: Sequelize.STRING,
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
    },
        {
            tableName: 'generic_authenticationmst',
            paranoid: true
        });

    return GenericAuthenticationMst;
};
