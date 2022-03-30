const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PackingslipInvoicePayment = sequelize.define('PackingslipInvoicePayment', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        systemId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        mfgcodeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        paymentNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        paymentDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        paymentAmount: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: false
        },
        paymentType: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        accountReference: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bankAccountMasID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        bankAccountNo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bankName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        payToName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        payToAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        isPaymentVoided: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        voidPaymentReason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refVoidedPaymentNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refVoidedPaymentId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPaymentMode: {
            type: Sequelize.STRING,
            allowNull: false
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
        billToName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billToAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isZeroPayment: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        depositBatchNumber: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        refCustCreditMemoID: {
            type: Sequelize.INTEGER,
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
        offsetAmount: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        refGencTransModeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPaymentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        acctId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isMarkAsPaid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        subStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refundStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billToAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        billToContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        billToContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        payToAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        payToContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        payToContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'packingslip_invoice_payment'
        });

    PackingslipInvoicePayment.associate = (models) => {
        PackingslipInvoicePayment.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'mfgcodeID'
        });

        PackingslipInvoicePayment.hasMany(models.PackingslipInvoicePaymentDet, {
            foreignKey: 'refPackingslipInvoiceID',
            as: 'packingslip_invoice_payment_det'
        });

        PackingslipInvoicePayment.hasMany(models.PackingslipInvoicePaymentDet, {
            foreignKey: 'refRefundPaymentID',
            as: 'packingslip_invoice_Cust_PMT'
        });

        PackingslipInvoicePayment.belongsTo(models.TransactionModeMst, {
            foreignKey: 'refGencTransModeID',
            as: 'transactionModes'
        });
        PackingslipInvoicePayment.belongsTo(models.CustomerAddresses, {
            foreignKey: 'billToAddressID',
            as: 'billToCustomerAddresses'
        });
        PackingslipInvoicePayment.belongsTo(models.ContactPerson, {
            foreignKey: 'billToContactPersonID',
            as: 'billToAddrContactPerson'
        });
        PackingslipInvoicePayment.belongsTo(models.CustomerAddresses, {
            foreignKey: 'payToAddressID',
            as: 'payToCustomerAddresses'
        });
        PackingslipInvoicePayment.belongsTo(models.ContactPerson, {
            foreignKey: 'payToContactPersonID',
            as: 'payToAddrContactPerson'
        });
    };

    return PackingslipInvoicePayment;
};