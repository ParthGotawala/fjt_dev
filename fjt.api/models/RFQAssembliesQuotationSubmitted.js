const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssembliesQuotationSubmitted = sequelize.define('RFQAssembliesQuotationSubmitted', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqAssyID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        quoteNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        quoteInDate: {
            allowNull: false,
            type: Sequelize.DATE
        },
        quoteDueDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        quoteSubmitDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        bomInternalVersion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        BOMIssues: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        OtherNotes: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        custShippingAddressID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        custBillingAddressID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        custTermsID: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        bomLastVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        promotions: {
            allowNull: true,
            type: Sequelize.TEXT
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
        quoteValidTillDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        custShippingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        custBillingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        custShippingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        custShippingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        custBillingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        custBillingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'rfq_assemblies_quotation_submitted'
    });

    RFQAssembliesQuotationSubmitted.associate = (models) => {
        RFQAssembliesQuotationSubmitted.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssembly',
            foreignKey: 'rfqAssyID'
        });
        RFQAssembliesQuotationSubmitted.hasMany(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotation',
            foreignKey: 'refSubmittedQuoteID'
        });
        RFQAssembliesQuotationSubmitted.hasMany(models.RFQAssyQuoteSubmittedTermsAndConditions, {
            as: 'rfqAssyQuoteTermsAndCondition',
            foreignKey: 'RefSubmittedQuoteID'
        });
        RFQAssembliesQuotationSubmitted.hasMany(models.RFQAssyStandardClassDetail, {
            as: 'rfqAssyStandardClass',
            foreignKey: 'refSubmittedQuoteID'
        });
        RFQAssembliesQuotationSubmitted.hasMany(models.RFQQuoteIssueHistory, {
            as: 'rfqQuoteIssueHistory',
            foreignKey: 'refSubmittedQuoteID'
        });
        RFQAssembliesQuotationSubmitted.belongsTo(models.ContactPerson, {
            as: 'custShippingContactPersonDet',
            foreignKey: 'custShippingContactPersonID'
        });
        RFQAssembliesQuotationSubmitted.belongsTo(models.ContactPerson, {
            as: 'custBillingContactPersonDet',
            foreignKey: 'custBillingContactPersonID'
        });
    };

    return RFQAssembliesQuotationSubmitted;
};
