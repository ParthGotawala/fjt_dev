const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuantity = sequelize.define('RFQAssyQuantity', {
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
        rfqPriceGroupId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        rfqPriceGroupDetailId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        requestQty: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        quantityType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        materialTotal: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        materialHandling: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        materialScrapPercentage: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        materialScrap: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        materialCarryingCostPercentage: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        materialCarryingCost: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        excessQtyTotal: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        excessTotalDollar: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        leadCostTotal: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        attritionRateTotal: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        copyQtyId: {
            allowNull: false,
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
        }
    }, {
        paranoid: true,
        tableName: 'rfq_assy_quantity'
    });

    RFQAssyQuantity.associate = (models) => {
        RFQAssyQuantity.hasMany(models.RFQAssyQuantityTurnTime, {
            as: 'rfqAssyQtyTurnTime',
            foreignKey: 'rfqAssyQtyID'
        });

        RFQAssyQuantity.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });

        RFQAssyQuantity.hasMany(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLinteItem',
            foreignKey: 'qtyID'
        });

        RFQAssyQuantity.hasMany(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotations',
            foreignKey: 'rfqAssyQtyID'
        });

        RFQAssyQuantity.hasMany(models.RFQConsolidatedMFGPNLineItemQuantity, {
            as: 'rfqConsolidatedMFGPNLineItemQuantity',
            foreignKey: 'qtyID'
        });
        RFQAssyQuantity.belongsTo(models.RFQPriceGroup, {
            as: 'rfqPriceGroup',
            foreignKey: 'rfqPriceGroupId'
        });
        RFQAssyQuantity.belongsTo(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'rfqPriceGroupDetailId'
        });
    };

    return RFQAssyQuantity;
};