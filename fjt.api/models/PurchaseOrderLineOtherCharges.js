const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PurchaseOrderLineOtherCharges = sequelize.define('PurchaseOrderLineOtherCharges', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refPurchaseOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: false
        },
        frequency: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lineComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lineInternalComment: {
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
        }
    },
        {
            tableName: 'purchase_order_line_othercharges',
            paranoid: true
        });

    PurchaseOrderLineOtherCharges.associate = (models) => {
        PurchaseOrderLineOtherCharges.belongsTo(models.PurchaseOrderDet, {
            foreignKey: 'refPurchaseOrderDetID',
            as: 'purchaseOrderDet'
        });
        PurchaseOrderLineOtherCharges.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'component'
        });
    };
    return PurchaseOrderLineOtherCharges;
};
