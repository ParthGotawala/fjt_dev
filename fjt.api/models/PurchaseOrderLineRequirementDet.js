/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PurchaseOrderLineRequirementDet = sequelize.define('PurchaseOrderLineRequirementDet', {
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
        instruction: {
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
    }, {
        paranoid: true,
            tableName: 'purchase_order_line_requirement_det'
    });

    PurchaseOrderLineRequirementDet.associate = (models) => {
        PurchaseOrderLineRequirementDet.belongsTo(models.PurchaseOrderDet, {
            as: 'purchaseOrderDet',
            foreignKey: 'refPurchaseOrderDetID'
        });
    };
    return PurchaseOrderLineRequirementDet;
};
