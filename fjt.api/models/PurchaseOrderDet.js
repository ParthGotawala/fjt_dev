/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PurchaseOrderDet = sequelize.define('PurchaseOrderDet', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refPurchaseOrderID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mfgPartID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packagingID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partDescription: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pcbPerArray: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rohsStatusID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        internalRef: {
            type: Sequelize.STRING,
            allowNull: true
        },
        salesCommissionTo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        totalRelease: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        lineComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        category: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lineID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        supplierQuoteNumber: {
            type: Sequelize.STRING,
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
        internalLineComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isLineCustConsigned: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        lineCustomerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isNonUMIDStock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'purchase_order_det'
    });

    PurchaseOrderDet.associate = (models) => {
        PurchaseOrderDet.belongsTo(models.PurchaseOrderMst, {
            as: 'purchaseOrderMst',
            foreignKey: 'refPurchaseOrderID'
        });
        PurchaseOrderDet.belongsTo(models.Component, {
            as: 'mfgParts',
            foreignKey: 'mfgPartID'
        });
        PurchaseOrderDet.belongsTo(models.Component, {
            as: 'supplierParts',
            foreignKey: 'supplierPartID'
        });
        PurchaseOrderDet.belongsTo(models.RFQRoHS, {
            as: 'rfqRoHS',
            foreignKey: 'rohsStatusID'
        });
        PurchaseOrderDet.belongsTo(models.ComponentPackagingMst, {
            as: 'componentPackagingMst',
            foreignKey: 'packagingID'
        });
        PurchaseOrderDet.belongsTo(models.Employee, {
            as: 'employees',
            foreignKey: 'salesCommissionTo'
        });
        PurchaseOrderDet.hasMany(models.PurchaseOrderLineOtherCharges, {
            as: 'purchaseOrderLineOtherCharges',
            foreignKey: 'refPurchaseOrderDetID'
        });
        PurchaseOrderDet.hasMany(models.PurchaseOrderLineReleaseDet, {
            as: 'purchaseOrderLineReleaseDet',
            foreignKey: 'refPurchaseOrderDetID'
        });
        PurchaseOrderDet.hasMany(models.PurchaseOrderLineRequirementDet, {
            as: 'purchaseOrderLineRequirementDet',
            foreignKey: 'refPurchaseOrderDetID'
        });
        PurchaseOrderDet.belongsTo(models.MfgCodeMst, {
            as: 'customers',
            foreignKey: 'lineCustomerID'
        });
    };

    return PurchaseOrderDet;
};
