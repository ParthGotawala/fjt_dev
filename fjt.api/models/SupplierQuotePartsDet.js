const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SupplierQuotePartsDet = sequelize.define('SupplierQuotePartsDet', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        supplierQuoteMstID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        supplierPartID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
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
        },
        scanLabel: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'supplier_quote_parts_det'
    });

    SupplierQuotePartsDet.associate = (models) => {
        SupplierQuotePartsDet.belongsTo(models.SupplierQuoteMst, {
            as: 'supplier_quote_mst',
            foreignKey: 'supplierQuoteMstID'
        });

        SupplierQuotePartsDet.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
        SupplierQuotePartsDet.belongsTo(models.Component, {
            as: 'supplierComponent',
            foreignKey: 'supplierPartID'
        });

        SupplierQuotePartsDet.hasMany(models.SupplierQuotePartAttribute, {
            foreignKey: 'supplierQuotePartDetID',
            as: 'supplier_quote_part_attributes'
        });
        SupplierQuotePartsDet.hasMany(models.SupplierQuotePartPrice, {
            foreignKey: 'supplierQuotePartDetID',
            as: 'supplier_quote_part_price_det'
        });
    };

    return SupplierQuotePartsDet;
};