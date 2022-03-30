const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineItems = sequelize.define('RFQLineItems', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        lineID: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        qpa: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        refDesig: {
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
        description: {
            type: Sequelize.TEXT,
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
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
        customerRev: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        numOfPosition: {
            type: Sequelize.DECIMAL(6, 6),
            allowNull: true
        },
        dnpQty: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        dnpDesig: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_lineID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_qpa: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        org_refDesig: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_custPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_uomName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_isInstall: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_isPurchase: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_customerRev: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_customerDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_numOfPosition: {
            type: Sequelize.DECIMAL(6, 6),
            allowNull: true
        },
        qpaDesignatorStep: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        customerPartDesc: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_customerPartDesc: {
            type: Sequelize.STRING,
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
        isBuyDNPQty: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
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
        programingStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refDesigCount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isObsoleteLine: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        cust_lineID: {
            type: Sequelize.STRING,
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
        substitutesAllow: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        org_substitutesAllow: {
            type: Sequelize.STRING,
            allowNull: true
        },
        numOfRows: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        org_numOfRows: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        restrictCPNUseWithPermissionStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictCPNUsePermanentlyStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictCPNUseInBOMStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerApprovalCPN: {
            type: Sequelize.TEXT,
            allowNull: true
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
        org_dnpQty: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        org_dnpDesig: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_buyDNPQty: {
            type: Sequelize.STRING,
            allowNull: true
        },
        requireMountingTypeError: {
            type: Sequelize.STRING,
            allowNull: true
        },
        requireFunctionalTypeError: {
            type: Sequelize.BOOLEAN,
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
        isNotRequiredKitAllocation: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isSupplierToBuy: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        programmingMappingPendingRefdesCount: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        paranoid: true,
        tableName: 'rfq_lineitems'
    });

    RFQLineItems.associate = (models) => {
        RFQLineItems.hasMany(models.RFQLineitemsAlternatepart, {
            as: 'rfqLineitemsAlternetpart',
            foreignKey: 'rfqLineItemsID'
        });

        RFQLineItems.hasMany(models.RFQLineitemsAdditionalComment, {
            as: 'rfqLineitemsAddtionalComment',
            foreignKey: 'rfqLineItemID'
        });

        RFQLineItems.belongsTo(models.Component, {
            as: 'custPNIDcomponent',
            foreignKey: 'custPNID'
        });

        RFQLineItems.belongsTo(models.UOMs, {
            as: 'uoms',
            foreignKey: 'uomID'
        });

        RFQLineItems.hasMany(models.ComponentCustomerLOA, {
            as: 'customerLOA',
            foreignKey: 'refLineitemID'
        });

        RFQLineItems.hasOne(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLineItem',
            foreignKey: 'rfqLineItemID'
        });

        RFQLineItems.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
        RFQLineItems.hasMany(models.PurchasePartsDetails, {
            as: 'PurchasePartsDetails',
            foreignKey: 'refBOMLineID'
        });
        RFQLineItems.hasMany(models.RFQLineItemsProgrammingMapping, {
            foreignKey: 'softwareRFQLineItemID',
            as: 'softwareLineItemsProgrammingMapping'
        });
        RFQLineItems.hasMany(models.RFQLineItemsProgrammingMapping, {
            foreignKey: 'rfqLineItemID',
            as: 'partLineItemsProgrammingMapping'
        });
    };

    return RFQLineItems;
};
