const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuotations = sequelize.define('RFQAssyQuotations', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqAssyID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        rfqAssyQtyID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        rfqAssyQtyTurnTimeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        rfqPriceGroupId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        rfqPriceGroupDetailId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        requestedQty: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        turnTime: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        timeType: {
            allowNull: true,
            type: Sequelize.STRING
        },
        unitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        materialCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        excessQtyTotalPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        total: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        laborunitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        laborday: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        days: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        refSubmittedQuoteID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        manualTurnTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        manualTurnType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        laborCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        laborDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nreCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        nreDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        materialDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nonQuotedConsolidatelineItemIDs: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        historyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        toolingDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        toolingCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        overheadCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        overheadDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        allCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        allDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        overheadUnitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        overheadDay: {
            allowNull: true,
            type: Sequelize.INTEGER
        }
    }, {
        paranoid: true,
        tableName: 'rfq_assy_quotations'
    });

    RFQAssyQuotations.associate = (models) => {
        RFQAssyQuotations.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });
        RFQAssyQuotations.belongsTo(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'rfqAssyQtyID'
        });
        RFQAssyQuotations.belongsTo(models.RFQAssyQuantityTurnTime, {
            as: 'rfqAssyQuantityTurnTime',
            foreignKey: 'rfqAssyQtyTurnTimeID'
        });
        RFQAssyQuotations.hasMany(models.RFQAssyQuotationsAdditionalCost, {
            as: 'rfqAssyQuotationsAdditionalCost',
            foreignKey: 'rfqAssyQuoteID'
        });
        RFQAssyQuotations.hasMany(models.RFQAssyQuotationsCustomparts, {
            as: 'rfqAssyQuotationsCustomParts',
            foreignKey: 'rfqAssyQuoteID'
        });
        RFQAssyQuotations.belongsTo(models.RFQAssembliesQuotationSubmitted, {
            as: 'rfqAssyQuoteSubmitted',
            foreignKey: 'refSubmittedQuoteID'
        });
        RFQAssyQuotations.belongsTo(models.RFQPriceGroup, {
            as: 'rfqPriceGroup',
            foreignKey: 'rfqPriceGroupId'
        });
        RFQAssyQuotations.belongsTo(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'rfqPriceGroupDetailId'
        });
    };

    return RFQAssyQuotations;
};