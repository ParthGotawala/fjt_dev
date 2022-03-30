/* eslint-disable global-require */
module.exports = (sequelize) => {
    const Sequelize = require('sequelize');
    const SupplierQuotePartPrice = sequelize.define('SupplierQuotePartPrice', {
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
        itemNumber: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        qty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        leadTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        UnitOfTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        UnitPrice: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        negotiatePrice: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        min: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mult: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packageID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        reeling: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        NCNR: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isPartCosting: {
            type: Sequelize.BOOLEAN,
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
        tableName: 'supplier_quote_part_price'
    });

    SupplierQuotePartPrice.associate = (models) => {
        SupplierQuotePartPrice.belongsTo(models.SupplierQuotePartsDet, {
            as: 'supplier_quote_parts_det',
            foreignKey: 'supplierQuotePartDetID'
        });
        SupplierQuotePartPrice.hasMany(models.SupplierQuotePartPriceAttribute, {
            foreignKey: 'supplierQuotePartPriceID',
            as: 'supplier_Quote_Part_Price_Attribute'
        });
        SupplierQuotePartPrice.belongsTo(models.ComponentPackagingMst, {
            as: 'Component_PackagingMst',
            foreignKey: 'packageID'
        });
    };

    return SupplierQuotePartPrice;
};