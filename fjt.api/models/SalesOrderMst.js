/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SalesOrderMst = sequelize.define('SalesOrderMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        salesOrderNumber: {
            type: Sequelize.STRING,
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
        soDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        contactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        billingAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingMethodID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        revision: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        internalComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        termsID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
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
        revisionChangeNote: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isAddnew: {
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
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        salesCommissionTo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        freeOnBoardId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        intermediateShipmentId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        serialNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        carrierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierAccountNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isBlanketPO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        poRevision: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isLegacyPO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isRmaPO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        originalPODate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        isAlreadyPublished: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAskForVersionConfirmation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        poRevisionDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        rmaNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDebitedByCustomer: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        orgPONumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        orgSalesOrderID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isReworkRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        reworkPONumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        blanketPOOption: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        linkToBlanketPO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        billingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billingContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        billingContactPersonID: {
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
        },
        intermediateAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        intermediateContactPerson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        intermediateContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'salesordermst'
    });

    SalesOrderMst.associate = (models) => {
        SalesOrderMst.belongsTo(models.MfgCodeMst, {
            as: 'customers',
            foreignKey: 'customerID'
        });
        SalesOrderMst.belongsTo(models.ContactPerson, {
            as: 'contactPerson',
            foreignKey: 'contactPersonID'
        });
        SalesOrderMst.belongsTo(models.CustomerAddresses, {
            as: 'customerBillingAddress',
            foreignKey: 'billingAddressID'
        });
        SalesOrderMst.belongsTo(models.CustomerAddresses, {
            as: 'customerShippingAddress',
            foreignKey: 'shippingAddressID'
        });
        SalesOrderMst.belongsTo(models.GenericCategory, {
            as: 'shippingMethod',
            foreignKey: 'shippingMethodID'
        });
        SalesOrderMst.hasMany(models.SalesOrderDet, {
            as: 'salesOrderDet',
            foreignKey: 'refSalesOrderID'
        });
        SalesOrderMst.belongsTo(models.Employee, {
            as: 'employees',
            foreignKey: 'salesCommissionTo'
        });
        SalesOrderMst.hasMany(models.CustomerPackingSlip, {
            as: 'customerPackingSlip',
            foreignKey: 'refSalesOrderID'
        });
        SalesOrderMst.belongsTo(models.CustomerAddresses, {
            as: 'customerAddresses',
            foreignKey: 'intermediateShipmentId'
        });
        SalesOrderMst.belongsTo(models.FreeOnBoardMst, {
            as: 'freeonboardmst',
            foreignKey: 'freeOnBoardId'
        });
        SalesOrderMst.belongsTo(models.GenericCategory, {
            as: 'carrierSalesOrderMst',
            foreignKey: 'carrierID'
        });
        SalesOrderMst.hasMany(models.AssemblyStock, {
            as: 'InitialStockMst',
            foreignKey: 'refSalesOrderID'
        });
        SalesOrderMst.belongsTo(models.ContactPerson, {
            as: 'billingContactPersonDet',
            foreignKey: 'billingContactPersonID'
        });
        SalesOrderMst.belongsTo(models.ContactPerson, {
            as: 'shippingContactPersonDet',
            foreignKey: 'shippingContactPersonID'
        });
        SalesOrderMst.belongsTo(models.ContactPerson, {
            as: 'intermediateContactPersonDet',
            foreignKey: 'intermediateContactPersonID'
        });
    };

    return SalesOrderMst;
};
