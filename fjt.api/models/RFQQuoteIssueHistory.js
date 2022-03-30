/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQQuoteIssueHistory = sequelize.define('RFQQuoteIssueHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refSubmittedQuoteID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        issueType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        PIDCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lineID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refDesg: {
            type: Sequelize.STRING,
            allowNull: true
        },
        CPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        CPNRev: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mfrCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mfrPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        BOMIssue: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isCustomerApproved: {
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
        },
        componentId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isCustom: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            tableName: 'rfq_quote_issue_history',
            paranoid: true
        }
    );

    RFQQuoteIssueHistory.associate = (models) => {
        RFQQuoteIssueHistory.belongsTo(models.RFQAssemblies, {
            foreignKey: 'rfqAssyID',
            as: 'rfq_assembly'
        });
        RFQQuoteIssueHistory.belongsTo(models.RFQAssembliesQuotationSubmitted, {
            foreignKey: 'refSubmittedQuoteID',
            as: 'rfqAssyQuoteSubmitted'
        });
    };


    return RFQQuoteIssueHistory;
};
