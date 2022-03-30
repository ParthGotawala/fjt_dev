const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PackingSlipMaterialReceiveDet = sequelize.define('PackingSlipMaterialReceiveDet', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refPackingSlipMaterialRecID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packingSlipSerialNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        internalRef: {
            type: Sequelize.STRING,
            allowNull: true
        },
        nickname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refSupplierPartId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        scanLabel: {
            type: Sequelize.STRING,
            allowNull: true
        },
        orderedQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        receivedQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        packingSlipQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        binID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        warehouseID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        parentWarehouseID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        invoicePrice: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        purchasePrice: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        disputedPrice: {
            type: Sequelize.DECIMAL,
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
        approveNote: {
            type: Sequelize.STRING,
            allowNull: true
        },
        otherCharges: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true
        },
        extendedPrice: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        extendedReceivedPrice: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        refCreditDebitInvoiceNo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refPackingSlipDetId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        difference: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        differenceQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        isMemoForPrice: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isMemoForQty: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        umidCreated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        umidCreatedQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        rmaCreatedQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        poReleaseNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        packagingID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        receivedStatus: {
            type: Sequelize.STRING,
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
        comment: {
            type: Sequelize.STRING,
            allowNUll: true
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
        allReceivedQty: {
            type: Sequelize.STRING,
            allowNull: true
        },
        purchaseInspectionComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refPackingSlipIdForRma: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPackingSlipDetIdForRMA: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refInvoiceIdForRma: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPackingSlipForRma: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refInvoiceForRma: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refPurchaseOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPOReleaseLineID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPOLineID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        discount: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        rohsstatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isReceivedWrongPart: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        disputeQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        pendingLines: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        acceptedWithDeviationLines: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        totalLines: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rejectedLines: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        acceptedLines: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isLineCustConsigned: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isNonUMIDStock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        lineCustomerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isZeroValue: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'packing_slip_material_receive_det'
    });

    PackingSlipMaterialReceiveDet.associate = (models) => {
        PackingSlipMaterialReceiveDet.belongsTo(models.PackingSlipMaterialReceive, {
            as: 'packing_slip_material_receive',
            foreignKey: 'refPackingSlipMaterialRecID'
        });

        PackingSlipMaterialReceiveDet.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });

        PackingSlipMaterialReceiveDet.belongsTo(models.BinMst, {
            as: 'binmst',
            foreignKey: 'binID'
        });

        PackingSlipMaterialReceiveDet.belongsTo(models.WarehouseMst, {
            as: 'warehousemst',
            foreignKey: 'warehouseID'
        });

        PackingSlipMaterialReceiveDet.belongsTo(models.WarehouseMst, {
            as: 'parentWarehouse',
            foreignKey: 'parentWarehouseID'
        });

        PackingSlipMaterialReceiveDet.belongsTo(models.PackingSlipMaterialReceive, {
            as: 'ref_Packing_Slip_For_Rma',
            foreignKey: 'refPackingSlipIdForRma'
        });

        PackingSlipMaterialReceiveDet.belongsTo(models.PackingSlipMaterialReceive, {
            as: 'ref_Invoice_For_Rma',
            foreignKey: 'refInvoiceIdForRma'
        });
        PackingSlipMaterialReceiveDet.belongsTo(models.PurchaseOrderDet, {
            foreignKey: 'refPurchaseOrderDetID',
            as: 'refPurchaseOrderDet'

        });
        PackingSlipMaterialReceiveDet.belongsTo(models.PurchaseOrderLineReleaseDet, {
            foreignKey: 'refPOReleaseLineID',
            as: 'refPurchaseOrderLineReleaseDet'

        });
        PackingSlipMaterialReceiveDet.belongsTo(models.RFQRoHS, {
            foreignKey: 'rohsstatus',
            as: 'rfqRohsMst'
        });
        PackingSlipMaterialReceiveDet.hasMany(models.PackingSlipMaterialReceiveDetStock, {
            foreignKey: 'refPackingSlipDetId',
            as: 'packingSlipMaterialReceiveDetStock'
        });

        PackingSlipMaterialReceiveDet.belongsTo(models.MfgCodeMst, {
            as: 'customers',
            foreignKey: 'lineCustomerID'
        });
    };

    return PackingSlipMaterialReceiveDet;
};