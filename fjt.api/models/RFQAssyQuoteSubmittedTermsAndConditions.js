const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuoteSubmittedTermsAndConditions = sequelize.define('RFQAssyQuoteSubmittedTermsAndConditions', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        RefSubmittedQuoteID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        termsconditionCatID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        termsconditionTypeValueID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        note: {
            type: Sequelize.TEXT,
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        paranoid: true,
        tableName: 'rfq_assy_quote_submitted_termsconditions'
    });

    RFQAssyQuoteSubmittedTermsAndConditions.associate = (models) => {
        RFQAssyQuoteSubmittedTermsAndConditions.belongsTo(models.ECOTypeCategory, {
            as: 'termsAndConditionCategory',
            foreignKey: 'termsconditionCatID'
        });
        RFQAssyQuoteSubmittedTermsAndConditions.belongsTo(models.ECOTypeValues, {
            as: 'termsAndConditionTypeValues',
            foreignKey: 'termsconditionTypeValueID'
        });
        RFQAssyQuoteSubmittedTermsAndConditions.belongsTo(models.RFQAssembliesQuotationSubmitted, {
            as: 'rfqAssyQuoteSubmitted',
            foreignKey: 'RefSubmittedQuoteID'
        });
    };

    return RFQAssyQuoteSubmittedTermsAndConditions;
};