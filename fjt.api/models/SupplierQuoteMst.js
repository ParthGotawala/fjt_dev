const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SupplierQuoteMst = sequelize.define('SupplierQuoteMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        quoteNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        quoteDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        reference: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billingAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        billingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        quoteStatus: {
            type: Sequelize.STRING,
            allowNull: false
        },
        documentPath: {
            type: Sequelize.STRING,
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
        tableName: 'supplier_quote_mst'
    });

    SupplierQuoteMst.associate = (models) => {
        SupplierQuoteMst.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'supplierID'
        });

        SupplierQuoteMst.belongsTo(models.CustomerAddresses, {
            as: 'supplierShippingAddress',
            foreignKey: 'shippingAddressID'
        });

        SupplierQuoteMst.belongsTo(models.CustomerAddresses, {
            as: 'supplierBillingAddress',
            foreignKey: 'billingAddressID'
        });

        SupplierQuoteMst.belongsTo(models.ContactPerson, {
            as: 'supplierQuoteBillingContactPerson',
            foreignKey: 'billingContactPersonID'
        });

        SupplierQuoteMst.belongsTo(models.ContactPerson, {
            as: 'supplierQuoteShippingContactPerson',
            foreignKey: 'shippingContactPersonID'
        });

        SupplierQuoteMst.hasMany(models.SupplierQuotePartsDet, {
            foreignKey: 'supplierQuoteMstID',
            as: 'supplier_quote_parts_det'
        });
    };

    return SupplierQuoteMst;
};