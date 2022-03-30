/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PurchaseOrderMst = sequelize.define('PurchaseOrderMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        poNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        poDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        soNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        soDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        termsID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shippingMethodID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        supplierAddressID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shippingAddressID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        contactPersonEmpID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        intermediateShipmentID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        freeOnBoardID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        poComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        serialNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        poRevision: {
            type: Sequelize.STRING,
            allowNull: false
        },
        carrierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierAccountNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingInsurance: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        supplierAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        intermediateAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isBlanketPO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAlreadyPublished: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        poWorkingStatus: {
            type: Sequelize.STRING,
            allowNull: false
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
        poCompleteReason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        poCompleteType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cancleReason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        CancellationConfirmed: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isCustConsigned: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isNonUMIDStock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        lockStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lockedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lockedByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lockedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isAskForVersionConfirmation: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        supplierContactPerson: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        supplierContactPersonID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        shippingContactPerson: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        shippingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        intermediateContactPerson: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        intermediateContactPersonID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        }
    }, {
        paranoid: true,
        tableName: 'purchase_order_mst'
    });

    PurchaseOrderMst.associate = (models) => {
        PurchaseOrderMst.belongsTo(models.MfgCodeMst, {
            as: 'suppliers',
            foreignKey: 'supplierID'
        });
        PurchaseOrderMst.belongsTo(models.GenericCategory, {
            as: 'paymentTerms',
            foreignKey: 'termsID'
        });
        PurchaseOrderMst.belongsTo(models.GenericCategory, {
            as: 'shippingMethod',
            foreignKey: 'shippingMethodID'
        });
        PurchaseOrderMst.belongsTo(models.GenericCategory, {
            as: 'carrierCategory',
            foreignKey: 'carrierID'
        });
        PurchaseOrderMst.belongsTo(models.CustomerAddresses, {
            as: 'billingAddress',
            foreignKey: 'supplierAddressID'
        });
        PurchaseOrderMst.belongsTo(models.CustomerAddresses, {
            as: 'billToShipToAddress',
            foreignKey: 'shippingAddressID'
        });
        PurchaseOrderMst.belongsTo(models.CustomerAddresses, {
            as: 'markForAddress',
            foreignKey: 'intermediateShipmentID'
        });
        PurchaseOrderMst.belongsTo(models.Employee, {
            as: 'employeePurchaseOrder',
            foreignKey: 'contactPersonEmpID'
        });
        PurchaseOrderMst.belongsTo(models.FreeOnBoardMst, {
            as: 'freeonboardmst',
            foreignKey: 'freeOnBoardID'
        });
        PurchaseOrderMst.hasMany(models.PurchaseOrderDet, {
            as: 'purchaseOrderDet',
            foreignKey: 'refPurchaseOrderID'
        });
        PurchaseOrderMst.hasMany(models.PackingSlipMaterialReceive, {
            foreignKey: 'refPurchaseOrderID',
            as: 'packingSlipMaterialReceive'
        });
        PurchaseOrderMst.belongsTo(models.MfgCodeMst, {
            as: 'customers',
            foreignKey: 'customerID'
        });
        PurchaseOrderMst.belongsTo(models.ContactPerson, {
            as: 'selectedContactPerson',
            foreignKey: 'supplierContactPersonID'
        });
        PurchaseOrderMst.belongsTo(models.ContactPerson, {
            as: 'selectedShippingContactPerson',
            foreignKey: 'shippingContactPersonID'
        });
        PurchaseOrderMst.belongsTo(models.ContactPerson, {
            as: 'selectedMarkForContactPerson',
            foreignKey: 'intermediateContactPersonID'
        });
        PurchaseOrderMst.belongsTo(models.User, {
            as: 'createdEmployee',
            foreignKey: 'createdBy'
        });
        PurchaseOrderMst.belongsTo(models.User, {
            as: 'updatedEmployee',
            foreignKey: 'updatedBy'
        });
    };
    return PurchaseOrderMst;
};
