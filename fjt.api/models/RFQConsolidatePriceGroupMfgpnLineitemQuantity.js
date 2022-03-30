const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQConsolidatePriceGroupMfgpnLineitemQuantity = sequelize.define('RFQConsolidatePriceGroupMfgpnLineitemQuantity', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refConsolidateLineitemQtyId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        consolidatedQty: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        tableName: 'rfq_consolidate_price_group_mfgpn_lineitem_quantity'
    });

    RFQConsolidatePriceGroupMfgpnLineitemQuantity.associate = (models) => {
        RFQConsolidatePriceGroupMfgpnLineitemQuantity.belongsTo(models.RFQConsolidatedMFGPNLineItemQuantity, {
            as: 'rfq_consolidate_mfgpn_lineitem_quantity',
            foreignKey: 'refConsolidateLineitemQtyId'
        });
    };

    return RFQConsolidatePriceGroupMfgpnLineitemQuantity;
};
