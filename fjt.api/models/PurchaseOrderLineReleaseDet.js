/* eslint-disable global-require */
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const PurchaseOrderLineReleaseDet = sequelize.define('PurchaseOrderLineReleaseDet', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refPurchaseOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shippingDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        promisedShipDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        releaseNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shippingMethodID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        releaseNotes: {
            type: Sequelize.STRING,
            allowNull: true
        },
        additionalNotes: {
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
        poLineWorkingStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        receivedQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        poLineCompleteReason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        poLineCompleteType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        carrierAccountNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        carrierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
            tableName: 'purchase_order_line_release_det'
    });

    PurchaseOrderLineReleaseDet.associate = (models) => {
        PurchaseOrderLineReleaseDet.belongsTo(models.PurchaseOrderDet, {
            as: 'purchaseOrderDet',
            foreignKey: 'refPurchaseOrderDetID'
        });
        PurchaseOrderLineReleaseDet.belongsTo(models.GenericCategory, {
            as: 'shippingMethodPurchaseOrder',
            foreignKey: 'shippingMethodID'
        });
        PurchaseOrderLineReleaseDet.belongsTo(models.CustomerAddresses, {
            as: 'customerPurchaseOrderAddress',
            foreignKey: 'shippingAddressID'
        });
        PurchaseOrderLineReleaseDet.belongsTo(models.GenericCategory, {
            as: 'releaseLineCarrierPurchaseOrder',
            foreignKey: 'carrierID'
        });
    };

    return PurchaseOrderLineReleaseDet;
};
