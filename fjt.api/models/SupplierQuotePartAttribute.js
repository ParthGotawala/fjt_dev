const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SupplierQuotePartAttribute = sequelize.define('SupplierQuotePartAttribute', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        supplierQuotePartDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        attributeID: {
            type: Sequelize.INTEGER,
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
        tableName: 'supplier_quote_part_attribute'
    });

    SupplierQuotePartAttribute.associate = (models) => {
        SupplierQuotePartAttribute.belongsTo(models.SupplierQuotePartsDet, {
            as: 'supplier_quote_parts_det',
            foreignKey: 'supplierQuotePartDetID'
        });
        SupplierQuotePartAttribute.belongsTo(models.QuoteDynamicFields, {
            as: 'quotecharges_dynamic_fields_mst',
            foreignKey: 'attributeID'
        });
    };

    return SupplierQuotePartAttribute;
};