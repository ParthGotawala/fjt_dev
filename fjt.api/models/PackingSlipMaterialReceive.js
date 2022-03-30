const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PackingSlipMaterialReceive = sequelize.define('PackingSlipMaterialReceive', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        systemId: {
            type: Sequelize.STRING,
            allowNull: true
        },
        poNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        poDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        mfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        supplierSONumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        soDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        packingSlipNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        packingSlipDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        invoiceNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        invoiceDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        creditMemoNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        creditMemoDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        debitMemoNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        debitMemoDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        receiptDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billToAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billToAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        billToConactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billToContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shipToAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        poVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        documentPath: {
            type: Sequelize.STRING,
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        receiptType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true
        },
        packingSlipModeStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        chequeNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bankName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        chequeDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        chequeAmount: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        applyDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        refParentCreditDebitInvoiceno: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPackingSlipNumberForInvoice: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        invoiceTotalDue: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        isTariffInvoice: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        creditMemoType: {
            type: Sequelize.STRING,
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
        },
        paymentTermsID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        termsDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        internalRemark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingMethodId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierAccountNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingInsurance: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        rmaShippingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rmaShippingAddressId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rmaShippingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rmaShippingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rmaMarkForContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rmaMarkForContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rmaMarkForAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rmaMarkForAddressId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        invoiceRequireManagementApproval: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        invoiceApprovalStatus: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 3
        },
        invoiceApprovedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        invoiceApprovalDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        invoiceApprovalComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refPurchaseOrderID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lockStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lockedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lockedByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lockedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        refSupplierCreditMemoNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        markedForRefund: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        markedForRefundAmt: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        holdUnholdId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refParentCreditDebitInvoiceHoldUnholdId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isCustConsigned: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isNonUMIDStock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isZeroValue: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'packing_slip_material_receive'
    });

    PackingSlipMaterialReceive.associate = (models) => {
        PackingSlipMaterialReceive.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'mfgCodeID'
        });

        PackingSlipMaterialReceive.hasMany(models.PackingSlipMaterialReceiveDet, {
            foreignKey: 'refPackingSlipMaterialRecID',
            as: 'packingSlipMaterialReceiveDet'
        });

        PackingSlipMaterialReceive.hasMany(models.PackingSlipTrackNumber, {
            foreignKey: 'refPackingSlipMaterialRecID',
            as: 'packingSlipTrackNumber'
        });

        PackingSlipMaterialReceive.belongsTo(models.PackingSlipMaterialReceive, {
            foreignKey: 'refPackingSlipNumberForInvoice',
            as: 'refInvoice'
        });

        PackingSlipMaterialReceive.hasMany(models.PackingslipInvoicePaymentDet, {
            foreignKey: 'refPackingslipInvoiceID',
            as: 'packingslip_invoice_payment_det'
        });

        PackingSlipMaterialReceive.belongsTo(models.GenericCategory, {
            foreignKey: 'paymentTermsID',
            as: 'paymentTerms'
        });

        PackingSlipMaterialReceive.belongsTo(models.GenericCategory, {
            foreignKey: 'shippingMethodId',
            as: 'shippingMethod'
        });

        PackingSlipMaterialReceive.belongsTo(models.GenericCategory, {
            foreignKey: 'carrierId',
            as: 'carrierMethod'
        });

        PackingSlipMaterialReceive.belongsTo(models.CustomerAddresses, {
            foreignKey: 'rmaShippingAddressId',
            as: 'supplierRmaShippingAddress'
        });

        PackingSlipMaterialReceive.belongsTo(models.ContactPerson, {
            foreignKey: 'rmaShippingContactPersonID',
            as: 'supplierRmaShippingContactPerson'
        });

        PackingSlipMaterialReceive.belongsTo(models.CustomerAddresses, {
            foreignKey: 'rmaMarkForAddressId',
            as: 'supplierRmaMarkedForAddress'
        });

        PackingSlipMaterialReceive.belongsTo(models.ContactPerson, {
            foreignKey: 'rmaMarkForContactPersonID',
            as: 'supplierRmaMarkedForContactPerson'
        });

        PackingSlipMaterialReceive.belongsTo(models.PackingSlipMaterialReceive, {
            foreignKey: 'refParentCreditDebitInvoiceno',
            as: 'refInvoiceOfMemo'
        });
        PackingSlipMaterialReceive.belongsTo(models.PurchaseOrderMst, {
            foreignKey: 'refPurchaseOrderID',
            as: 'refPurchaseOrder'
        });
        PackingSlipMaterialReceive.belongsTo(models.User, {
            foreignKey: 'lockedBy',
            as: 'packingSlipLockedBy'
        });
        PackingSlipMaterialReceive.belongsTo(models.MfgCodeMst, {
            as: 'customers',
            foreignKey: 'customerID'
        });

        PackingSlipMaterialReceive.belongsTo(models.CustomerAddresses, {
            foreignKey: 'billToAddressID',
            as: 'supplierBillToAddress'
        });

        PackingSlipMaterialReceive.belongsTo(models.ContactPerson, {
            foreignKey: 'billToContactPersonID',
            as: 'supplierBillToContactPerson'
        });
        PackingSlipMaterialReceive.belongsTo(models.User, {
            as: 'createdEmployee',
            foreignKey: 'createdBy'
        });
        PackingSlipMaterialReceive.belongsTo(models.User, {
            as: 'updatedEmployee',
            foreignKey: 'updatedBy'
        });
    };

    return PackingSlipMaterialReceive;
};