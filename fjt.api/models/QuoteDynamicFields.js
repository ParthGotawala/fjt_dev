const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const QuoteDynamicFields = sequelize.define('QuoteDynamicFields', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fieldName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        dataType: {
            type: Sequelize.INTEGER
        },
        costingType: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 255]
            }
        },
        displayPercentage: {
            type: Sequelize.BOOLEAN
        },
        displayMargin: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDaysRequire: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        defaultMarginValue: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: true
        },
        marginApplicableType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        defaultuomValue: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        selectionType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        affectType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        defaultuomType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        toolingQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        toolingPrice: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        applyToAll: {
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
        },
        isCommission: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isIncludeInOtherAttribute: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        refAttributeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        quoteAttributeType: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'quotecharges_dynamic_fields_mst'
        });

    QuoteDynamicFields.associate = (models) => {
        QuoteDynamicFields.hasMany(models.RFQAssyQuotationsAdditionalCost, {
            as: 'rfqAssyQuotationsAdditionalCost',
            foreignKey: 'quoteChargeDynamicFieldID'
        });
        QuoteDynamicFields.belongsTo(models.QuoteDynamicFields, {
            foreignKey: 'refAttributeID',
            as: 'refQuoteAttribute'
        });
        QuoteDynamicFields.hasMany(models.SupplierQuotePartPriceAttribute, {
            as: 'supplier_quote_part_price_attribute',
            foreignKey: 'attributeID'
        });
        QuoteDynamicFields.hasMany(models.SupplierQuotePartAttribute, {
            as: 'supplier_quote_part_attribute',
            foreignKey: 'attributeID'
        });
        QuoteDynamicFields.hasMany(models.SalesorderdetCommissionAttribute, {
            as: 'salesorderdetCommissionAttribute',
            foreignKey: 'refQuoteAttributeId'
        });
        QuoteDynamicFields.hasMany(models.SupplierAttributeTemplateDet, {
            as: 'supplier_Attribute_Template_Det',
            foreignKey: 'attributeID'
        });
    };

    return QuoteDynamicFields;
};