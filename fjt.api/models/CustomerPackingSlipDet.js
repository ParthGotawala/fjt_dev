/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CustomerPackingSlipDet = sequelize.define('CustomerPackingSlipDet', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refCustPackingSlipID: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        refSalesorderDetid: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        partId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        custPOLineID: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        poQty: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        shipQty: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        remainingQty: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        shippedQty: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        unitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        shippingNotes: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        whID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        binID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        shippingId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        reflineID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        refChargesTypeID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        otherCharges: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        assyDescription: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lineID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        internalComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        standrads: {
            type: Sequelize.STRING,
            allowNull: true
        },
        extendedPrice: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        componentStockType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        quoteNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        quoteFrom: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refAssyQtyTurnTimeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyQtyTurnTimeText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refRFQQtyTurnTimeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refRFQGroupID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isZeroValue: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        refCustPackingSlipDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        poReleaseNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refBlanketPONumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        releaseNotes: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'customer_packingslip_det',
        paranoid: true
    });

    CustomerPackingSlipDet.associate = (models) => {
        CustomerPackingSlipDet.belongsTo(models.CustomerPackingSlip, {
            as: 'customerPackingSlip',
            foreignKey: 'refCustPackingSlipID'
        });
        CustomerPackingSlipDet.belongsTo(models.SalesOrderDet, {
            foreignKey: 'refSalesorderDetid',
            as: 'salesorderDet'
        });
        CustomerPackingSlipDet.belongsTo(models.Component, {
            foreignKey: 'partId',
            as: 'component'
        });
        CustomerPackingSlipDet.belongsTo(models.WarehouseMst, {
            foreignKey: 'whID',
            as: 'warehouseMst'
        });
        CustomerPackingSlipDet.belongsTo(models.BinMst, {
            foreignKey: 'binID',
            as: 'binMst'
        });
        CustomerPackingSlipDet.belongsTo(models.SalesShippingMst, {
            foreignKey: 'shippingId',
            as: 'salesShippingMst'
        });
        CustomerPackingSlipDet.hasMany(models.ShippedAssembly, {
            foreignKey: 'refCustPackingSlipDetID',
            as: 'shippedAssembly'
        });
        CustomerPackingSlipDet.belongsTo(models.GenericCategory, {
            foreignKey: 'refChargesTypeID',
            as: 'chargesType'
        });
    };

    return CustomerPackingSlipDet;
};