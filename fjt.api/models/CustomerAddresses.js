/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CustomerAddresses = sequelize.define('CustomerAddresses', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        customerId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        personName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        contact: {
            type: Sequelize.STRING,
            allowNull: true
        },
        street1: {
            type: Sequelize.STRING,
            allowNull: true
        },
        street2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        street3: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true
        },
        countryID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        postcode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        addressType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDefault: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        division: {
            type: Sequelize.STRING,
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
        phExtension: {
            type: Sequelize.STRING,
            allowNull: true
        },
        companyName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        contactCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        faxNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        faxCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        bankRemitToName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        latitude: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: Sequelize.DECIMAL(11, 8),
            allowNull: true
        },
        additionalComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        defaultContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingMethodID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierAccount: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        defaultIntermediateAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        defaultIntermediateContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'customer_addresses'
    });

    CustomerAddresses.associate = (models) => {
        CustomerAddresses.belongsTo(models.MfgCodeMst, {
            as: 'customer',
            foreignKey: 'customerId'
        });
        CustomerAddresses.hasMany(models.SalesOrderMst, {
            foreignKey: 'billingAddressID',
            as: 'salesorderBillingAddress'
        });
        CustomerAddresses.hasMany(models.SalesOrderMst, {
            foreignKey: 'shippingAddressID',
            as: 'salesorderShippingAddress'
        });
        CustomerAddresses.hasMany(models.SalesShippingMst, {
            foreignKey: 'shippingAddressID',
            as: 'salesShippingAddress'
        });
        CustomerAddresses.hasMany(models.RFQForms, {
            foreignKey: 'custBillingAddID',
            as: 'customerBillingAddress'
        });
        CustomerAddresses.hasMany(models.RFQForms, {
            foreignKey: 'custShippingAddID',
            as: 'customerShippingAddress'
        });
        CustomerAddresses.belongsTo(models.CountryMst, {
            as: 'countryMst',
            foreignKey: 'countryID'
        });
        CustomerAddresses.hasMany(models.SupplierQuoteMst, {
            foreignKey: 'shippingAddressID',
            as: 'supplierQuoteShippingAddress'
        });
        CustomerAddresses.hasMany(models.SupplierQuoteMst, {
            foreignKey: 'billingAddressID',
            as: 'supplierQuoteBillingAddress'
        });
        CustomerAddresses.hasMany(models.SalesOrderMst, {
            foreignKey: 'intermediateShipmentId',
            as: 'salesorderMst'
        });
        CustomerAddresses.hasMany(models.CustomerPackingSlip, {
            foreignKey: 'intermediateShipmentId',
            as: 'customerPackingSlip'
        });
        CustomerAddresses.hasMany(models.CustomerPackingSlip, {
            foreignKey: 'shipToId',
            as: 'customerPackingSlipShipping'
        });
        CustomerAddresses.hasMany(models.CustomerPackingSlip, {
            foreignKey: 'billToId',
            as: 'customerPackingSlipBilling'
        });
        CustomerAddresses.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'supplierAddressID',
            as: 'purchaseOrderSupplier'
        });
        CustomerAddresses.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'shippingAddressID',
            as: 'purchaseOrderShipping'
        });
        CustomerAddresses.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'intermediateShipmentID',
            as: 'purchaseOrderIntermediate'
        });
        CustomerAddresses.hasMany(models.PurchaseOrderLineReleaseDet, {
            foreignKey: 'shippingAddressID',
            as: 'purchaseOrderLineReleaseShipping'
        });
        CustomerAddresses.belongsTo(models.ContactPerson, {
            foreignKey: 'defaultContactPersonID',
            as: 'contactPerson'
        });
         CustomerAddresses.belongsTo(models.GenericCategory, {
             foreignKey: 'shippingMethodID',
             as: 'shippingMethod'
         });
         CustomerAddresses.belongsTo(models.GenericCategory, {
             foreignKey: 'carrierID',
             as: 'Carrier'
         });
        CustomerAddresses.belongsTo(models.CustomerAddresses, {
            as: 'defaultIntmdCustomerAddresses',
            foreignKey: 'defaultIntermediateAddressID'
        });
        CustomerAddresses.belongsTo(models.ContactPerson, {
            as: 'defaultIntmdContactPerson',
            foreignKey: 'defaultIntermediateContactPersonID'
        });
    };

    return CustomerAddresses;
};
