const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQConsolidatedMFGPNLineItemQuantity = sequelize.define('RFQConsolidatedMFGPNLineItemQuantity', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        qtyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        consolidateID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        finalPrice: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        isdeleted: {
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
        unitPrice: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        supplier: {
            type: Sequelize.STRING,
            allowNull: true
        },
        selectedMpn: {
            type: Sequelize.STRING,
            allowNull: true
        },
        selectionMode: {
            type: Sequelize.STRING,
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
        currentStock: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        leadTime: {
            type: Sequelize.DECIMAL(10, 1),
            allowNull: true
        },
        supplierStock: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        grossStock: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        pricingSuppliers: {
            type: Sequelize.STRING,
            allowNull: true
        },
        selectedPIDCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        apiLead: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        componentID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packaging: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rfqQtySupplierID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        quoteQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        pricenotselectreason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        availableInternalStock: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        availableInternalStockTimeStamp: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isBomUpdate: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        LOAprice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        unitEachPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        quoteQtyEach: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        supplierEachStcok: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        rfqPriceGroupId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        rfqPriceGroupDetailId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        refSupplierID: {
            allowNull: true,
            type: Sequelize.INTEGER
        }
    }, {
        paranoid: true,
        tableName: 'rfq_consolidate_mfgpn_lineitem_quantity'
    });

    RFQConsolidatedMFGPNLineItemQuantity.associate = (models) => {
        RFQConsolidatedMFGPNLineItemQuantity.belongsTo(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLinteItem',
            foreignKey: 'consolidateID'
        });
        RFQConsolidatedMFGPNLineItemQuantity.belongsTo(models.MfgCodeMst, {
            as: 'refSupplierMfgCodeMst',
            foreignKey: 'refSupplierID'
        });
        RFQConsolidatedMFGPNLineItemQuantity.belongsTo(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'qtyID'
        });
        RFQConsolidatedMFGPNLineItemQuantity.belongsTo(models.RFQPriceGroup, {
            as: 'rfqPriceGroup',
            foreignKey: 'rfqPriceGroupId'
        });
        RFQConsolidatedMFGPNLineItemQuantity.belongsTo(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'rfqPriceGroupDetailId'
        });
    };

    return RFQConsolidatedMFGPNLineItemQuantity;
};
