const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SupplierQuotePartPriceAttribute = sequelize.define('SupplierQuotePartPriceAttribute', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        supplierQuotePartPriceID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        attributeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Price: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isDeleted: {
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
    }, {
        paranoid: true,
        tableName: 'supplier_quote_part_price_attribute'
    });

    SupplierQuotePartPriceAttribute.associate = (models) => {
        SupplierQuotePartPriceAttribute.belongsTo(models.SupplierQuotePartPrice, {
            as: 'supplier_quote_parts_det',
            foreignKey: 'supplierQuotePartPriceID'
        });
        SupplierQuotePartPriceAttribute.belongsTo(models.QuoteDynamicFields, {
            as: 'quotecharges_dynamic_fields_mst',
            foreignKey: 'attributeID'
        });
    };

    return SupplierQuotePartPriceAttribute;
};