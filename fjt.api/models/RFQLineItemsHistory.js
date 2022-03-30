const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineItemsHistory = sequelize.define('RFQLineItemsHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refSubmittedQuoteID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        refDesigCount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dnpDesigCount: {
            type: Sequelize.INTEGER,
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
        alternetMfgPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        uomID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        programingStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        level: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        notes: {
            type: Sequelize.STRING,
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
        isNoBidsPN: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDraft: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        partTypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partclassID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        leadQty: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        attritionRate: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        totalQty: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        manualAdj: {
            type: Sequelize.DECIMAL(8, 2),
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
        valueAddedCost: {
            type: Sequelize.DECIMAL(6, 6),
            allowNull: true
        },
        numOfPosition: {
            type: Sequelize.DECIMAL(6, 6),
            allowNull: true
        },
        numOfRows: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        customerRev: {
            type: Sequelize.STRING,
            allowNull: true
        },
        flextronRev: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refRFQLineItemID: {
            type: Sequelize.INTEGER,
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
        org_level: {
            type: Sequelize.FLOAT,
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
        org_refLineID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        qpaDesignatorStep: {
            type: Sequelize.BOOLEAN,
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
        isObsoleteLine: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        qpaDesignatorColorPriority: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        miscStep: {
            type: Sequelize.BOOLEAN,
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
        cust_lineID: {
            type: Sequelize.STRING,
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
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerApprovalForDNPQPAREFDESStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerApprovalForDNPBuyStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        dnpInvalidREFDESStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isNotRequiredKitAllocation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isSupplierToBuy: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'rfq_lineitems_history'
    });

    RFQLineItemsHistory.associate = (models) => {
        RFQLineItemsHistory.belongsTo(models.RFQAssembliesQuotationSubmitted, {
            as: 'rfqAssySubmittedBom',
            foreignKey: 'refSubmittedQuoteID'
        });

        RFQLineItemsHistory.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });

        RFQLineItemsHistory.hasMany(models.RFQLineitemsAlternatepartHistory, {
            as: 'rfqLineitemsAlternetparts',
            foreignKey: 'rfqLineItemsID'
        });

        RFQLineItemsHistory.belongsTo(models.Component, {
            as: 'customComponent',
            foreignKey: 'custPNID'
        });

        RFQLineItemsHistory.belongsTo(models.UOMs, {
            as: 'uoms',
            foreignKey: 'uomID'
        });

        RFQLineItemsHistory.belongsTo(models.RFQPartType, {
            as: 'rfqPartType',
            foreignKey: 'partTypeID'
        });

        RFQLineItemsHistory.belongsTo(models.RFQMountingType, {
            as: 'rfqMountingType',
            foreignKey: 'partclassID'
        });

        RFQLineItemsHistory.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
    };

    return RFQLineItemsHistory;
};
