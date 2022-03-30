/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CustomerPackingSlip = sequelize.define('CustomerPackingSlip', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        packingSlipType: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        transType: {
            type: Sequelize.STRING,
            allowNUll: false
        },
        status: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        refSalesOrderID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        poNumber: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        poDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        soNumber: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        soDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        packingSlipNumber: {
            type: Sequelize.STRING,
            allowNUll: false
        },
        packingSlipDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        refEpicorePSNumber: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        invoiceNumber: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        invoiceDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        refEpicoreINVNumber: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        shippingMethodId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        shipToId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        contactPersonId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        packingSlipComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        freeOnBoardId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        paymentNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        paymentDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        paymentAmount: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        paymentStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        headerComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        intermediateShipmentId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        sorevision: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refCustInvoiceID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        bankName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        packingSlipStatus: {
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        },
        billToId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        salesCommissionTo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        termsID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        systemID: {
            type: Sequelize.STRING,
            allowNull: false
        },
        billingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        intermediateAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lockedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isLocked: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        lockedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        lockedByRole: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        subStatus: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        totalAmount: {
            type: Sequelize.DECIMAL(18, 8),
            allowNUll: true
        },
        creditMemoNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        creditMemoDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        refDebitMemoNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refDebitMemoDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        rmaNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        revision: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isZeroValue: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        isAlreadyPublished: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        poRevision: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isMarkForRefund: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        agreedRefundAmt: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        isAskForVersionConfirmation: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        carrierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierAccountNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        billingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        intermediateContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        intermediateContactPerson: {
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
        }
    }, {
        tableName: 'customer_packingslip',
        paranoid: true
    });

    CustomerPackingSlip.associate = (models) => {
        CustomerPackingSlip.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodeMst',
            foreignKey: 'customerID'
        });
        CustomerPackingSlip.belongsTo(models.SalesOrderMst, {
            foreignKey: 'refSalesOrderID',
            as: 'salesorderMst'
        });
        CustomerPackingSlip.belongsTo(models.GenericCategory, {
            foreignKey: 'shippingMethodId',
            as: 'shippingMethod'
        });
        CustomerPackingSlip.hasMany(models.CustomerPackingSlipDet, {
            foreignKey: 'refCustPackingSlipID',
            as: 'customerPackingSlipDet'
        });
        CustomerPackingSlip.belongsTo(models.ContactPerson, {
            foreignKey: 'contactPersonId',
            as: 'contactPerson'
        });
        CustomerPackingSlip.belongsTo(models.CustomerAddresses, {
            foreignKey: 'shipToId',
            as: 'customerAddressShipping'
        });
        CustomerPackingSlip.belongsTo(models.CustomerAddresses, {
            foreignKey: 'intermediateShipmentId',
            as: 'customerAddressIntermediate'
        });
        CustomerPackingSlip.belongsTo(models.FreeOnBoardMst, {
            foreignKey: 'freeOnBoardId',
            as: 'freeonboardmst'
        });
        CustomerPackingSlip.belongsTo(models.CustomerPackingSlip, {
            foreignKey: 'refCustInvoiceID',
            as: 'customerInvoiceDet'
        });
        CustomerPackingSlip.hasMany(models.CustomerPackingSlip, {
            foreignKey: 'refCustInvoiceID',
            as: 'customerInvoiceDetLst'
        });
        CustomerPackingSlip.belongsTo(models.Employee, {
            as: 'employees',
            foreignKey: 'salesCommissionTo'
        });
        CustomerPackingSlip.belongsTo(models.CustomerAddresses, {
            as: 'customerBillingAddress',
            foreignKey: 'billToId'
        });
        CustomerPackingSlip.hasMany(models.CustomerPackingSlipTrackNumber, {
            as: 'customerPackingSlipTrackNumber',
            foreignKey: 'refCustPackingSlipID'
        });
        CustomerPackingSlip.belongsTo(models.User, {
            as: 'lockEmployees',
            foreignKey: 'lockedBy'
        });
        CustomerPackingSlip.hasOne(models.PackingslipInvoicePayment, {
            as: 'packingslipInvoicePayment',
            foreignKey: 'refCustCreditMemoID'
        });
        CustomerPackingSlip.hasMany(models.PackingslipInvoicePaymentDet, {
            as: 'PackingslipInvoicePaymentDet',
            foreignKey: 'refRefundCustCreditMemoID'
        });
        CustomerPackingSlip.belongsTo(models.User, {
            as: 'createdEmployee',
            foreignKey: 'createdBy'
        });
        CustomerPackingSlip.belongsTo(models.User, {
            as: 'updatedEmployee',
            foreignKey: 'updatedBy'
        });
        CustomerPackingSlip.belongsTo(models.GenericCategory, {
            as: 'carrierCustomerPackingSlip',
            foreignKey: 'carrierID'
        });
        CustomerPackingSlip.belongsTo(models.ContactPerson, {
            foreignKey: 'billingContactPersonID',
            as: 'billToAddrContactPerson'
        });
        CustomerPackingSlip.belongsTo(models.ContactPerson, {
            foreignKey: 'shippingContactPersonID',
            as: 'shipToAddrContactPerson'
        });
        CustomerPackingSlip.belongsTo(models.ContactPerson, {
            foreignKey: 'intermediateContactPersonID',
            as: 'interToAddrContactPerson'
        });
    };

    return CustomerPackingSlip;
};