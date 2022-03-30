/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SalesShippingMst = sequelize.define('SalesShippingMst', {
        shippingID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        sDetID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shippingDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        shippingMethodID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingAddressID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        priority: {
            type: Sequelize.STRING,
            allowNull: true
        },
        packingSlipNo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        invoiceNo: {
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
        releaseNotes: {
            type: Sequelize.STRING,
            allowNull: true
        },
        promisedShipDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        releaseNumber: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        requestedDockDate: {
            type: Sequelize.DATEONLY,
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
        customerReleaseLine: {
            type: Sequelize.STRING,
            allowNull: true
        },
        revisedRequestedDockDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        revisedRequestedShipDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        revisedRequestedPromisedDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        poReleaseNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isAgreeToShip: {
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
        isReadyToShip: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        shippingContactPersonID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'salesshippingmst'
    });

    SalesShippingMst.associate = (models) => {
        SalesShippingMst.belongsTo(models.SalesOrderDet, {
            as: 'salesOrderDet',
            foreignKey: 'sDetID'
        });
        SalesShippingMst.belongsTo(models.CustomerAddresses, {
            as: 'customerSalesShippingAddress',
            foreignKey: 'shippingAddressID'
        });
        SalesShippingMst.belongsTo(models.GenericCategory, {
            as: 'shippingMethodSalesOrder',
            foreignKey: 'shippingMethodID'
        });
        SalesShippingMst.hasMany(models.ShippedAssembly, {
            as: 'shippedAssembly',
            foreignKey: 'shippingId'
        });
        SalesShippingMst.hasMany(models.CustomerPackingSlipDet, {
            as: 'customerPackingSlipDet',
            foreignKey: 'shippingId'
        });
        SalesShippingMst.belongsTo(models.GenericCategory, {
            as: 'carrierSalesOrder',
            foreignKey: 'carrierID'
        });
        SalesShippingMst.belongsTo(models.ContactPerson, {
            as: 'shippingContactPersonDetail',
            foreignKey: 'shippingContactPersonID'
        });
    };

    return SalesShippingMst;
};
