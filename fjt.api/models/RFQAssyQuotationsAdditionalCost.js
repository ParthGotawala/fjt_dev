const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuotationsAdditionalCost = sequelize.define('RFQAssyQuotationsAdditionalCost', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqAssyQuoteID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        quoteChargeDynamicFieldID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        percentage: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        margin: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        days: {
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
        toolingQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refCustomPartQuoteID: {
            allowNull: true,
            type: Sequelize.INTEGER
        }
    }, {
        paranoid: true,
        tableName: 'rfq_assy_quotations_additionalcost'
    });

    RFQAssyQuotationsAdditionalCost.associate = (models) => {
        RFQAssyQuotationsAdditionalCost.belongsTo(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotations',
            foreignKey: 'rfqAssyQuoteID'
        });
        RFQAssyQuotationsAdditionalCost.belongsTo(models.QuoteDynamicFields, {
            as: 'quoteDynamicFields',
            foreignKey: 'quoteChargeDynamicFieldID'
        });
        RFQAssyQuotationsAdditionalCost.belongsTo(models.RFQAssyQuotationsCustomparts, {
            as: 'rfqAssyCustomParts',
            foreignKey: 'refCustomPartQuoteID'
        });
    };

    return RFQAssyQuotationsAdditionalCost;
};