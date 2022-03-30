const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQConsolidatedMFGPNLineItem = sequelize.define('RFQConsolidatedMFGPNLineItem', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        lineID: {
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
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqLineItemID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        uomID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        totalQty: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        requestQty: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        originalTotalQty: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        isMultiple: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        numOfPosition: {
            type: Sequelize.DECIMAL(8, 2),
            allowNull: true
        },
        numOfRows: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qpa: {
            type: Sequelize.DECIMAL(16, 8),
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
        isqpaMismatch: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        consolidatedpartlineID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        consolidatedPartWithFlagDetail: {
            type: Sequelize.STRING,
            allowNull: true
        }

    }, {
        paranoid: true,
        tableName: 'rfq_consolidated_mfgpn_lineitem'
    });

    RFQConsolidatedMFGPNLineItem.associate = (models) => {
        RFQConsolidatedMFGPNLineItem.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });
        RFQConsolidatedMFGPNLineItem.belongsTo(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'qtyID'
        });
        RFQConsolidatedMFGPNLineItem.hasMany(models.RFQConsolidatedMFGPNLineItemAlternate, {
            as: 'rfqConsolidatedMFGPNLineItemAlternate',
            foreignKey: 'consolidateID'
        });
        RFQConsolidatedMFGPNLineItem.hasMany(models.RFQConsolidatedMFGPNLineItemQuantity, {
            as: 'rfqConsolidatedMFGPNLineItemQuantity',
            foreignKey: 'consolidateID'
        });

        RFQConsolidatedMFGPNLineItem.belongsTo(models.RFQLineItems, {
            as: 'rfqLineItems',
            foreignKey: 'rfqLineItemID'
        });

        RFQConsolidatedMFGPNLineItem.belongsTo(models.UOMs, {
            as: 'uoms',
            foreignKey: 'uomID'
        });
    };

    return RFQConsolidatedMFGPNLineItem;
};
