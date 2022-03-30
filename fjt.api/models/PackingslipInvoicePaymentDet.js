const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PackingslipInvoicePaymentDet = sequelize.define('PackingslipInvoicePaymentDet', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refPayementid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refPackingslipInvoiceID: {
            type: Sequelize.INTEGER,
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
        paymentAmount: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: false
        },
        refCustPackingslipInvoiceID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isPaymentVoided: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        appliedDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        refRefundPaymentID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refRefundCustCreditMemoID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'packingslip_invoice_payment_det'
    });

    PackingslipInvoicePaymentDet.associate = (models) => {
        PackingslipInvoicePaymentDet.belongsTo(models.PackingslipInvoicePayment, {
            as: 'packingslip_invoice_payment',
            foreignKey: 'refPayementid'
        });
        PackingslipInvoicePaymentDet.belongsTo(models.PackingSlipMaterialReceive, {
            as: 'packing_slip_material_receive',
            foreignKey: 'refPackingslipInvoiceID'
        });
        PackingslipInvoicePaymentDet.belongsTo(models.PackingslipInvoicePayment, {
            as: 'packingslip_invoice_Cust_PMT',
            foreignKey: 'refRefundPaymentID'
        });
        PackingslipInvoicePaymentDet.belongsTo(models.CustomerPackingSlip, {
            as: 'customer_packingSlip',
            foreignKey: 'refRefundCustCreditMemoID'
        });
    };

    return PackingslipInvoicePaymentDet;
};