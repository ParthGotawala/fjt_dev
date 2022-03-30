/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const KitAllocationLineitems = sequelize.define('KitAllocationLineitems', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refSalesOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refRfqLineitem: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lineID: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        qpa: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        dnpQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        isInstall: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isPurchase: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isBuyDNPQty: {
            type: Sequelize.STRING,
            allowNull: true
        },
        custPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        custPNID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        uomID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refMongoTrnsID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refPricePartID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refquoteQtyEach: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refQuoteQtyPriceEach: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        refQuoteUnitQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refQuoteUnitPriceEach: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        refpackagingID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refsupplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refLeadTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refSelectedPartQtyStock: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        refSelectedPartUnitStock: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        refsupplierQtyStcok: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        refsupplierUnitStock: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        refCumulativeStock: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        refPriceselectionMode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refCumulativeStockSuppliers: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isNotRequiredKitAllocation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
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
        refDesig: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerRev: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dnpDesig: {
            type: Sequelize.STRING,
            allowNull: true
        },
        programingStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        cust_lineID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        substitutesAllow: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        numOfRows: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        customerPartDesc: {
            type: Sequelize.STRING,
            allowNull: true
        },
        qpaDesignatorStep: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mergeLines: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lineMergeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        duplicateCPNStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        requireMountingTypeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        requireFunctionalTypeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        refDesigCount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isObsoleteLine: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerApprovalForQPAREFDESStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        customerApprovalForBuyStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        customerApprovalForPopulateStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        customerApprovalCPNBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        customerApprovalCPNDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        dnpDesigCount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        requireMountingTypeError: {
            type: Sequelize.STRING,
            allowNull: true
        },
        requireFunctionalTypeError: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dnpQPARefDesStep: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: true
        },
        customerApprovalForDNPQPAREFDESStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        customerApprovalForDNPBuyStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        isSupplierToBuy: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }, {
        paranoid: true,
        tableName: 'kit_allocation_lineitems'
    });

    KitAllocationLineitems.associate = (models) => {
        KitAllocationLineitems.belongsTo(models.RFQLineItems, {
            as: 'rfq_lineItems',
            foreignKey: 'refRfqLineitem'
        });

        KitAllocationLineitems.belongsTo(models.Component, {
            as: 'customer_mfgpn',
            foreignKey: 'custPNID'
        });

        KitAllocationLineitems.belongsTo(models.UOMs, {
            as: 'uom',
            foreignKey: 'uomID'
        });

        KitAllocationLineitems.belongsTo(models.Component, {
            as: 'part',
            foreignKey: 'partID'
        });
    };

    return KitAllocationLineitems;
};