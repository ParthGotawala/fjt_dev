const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PackingSlipMaterialReceiveDetStock = sequelize.define('PackingSlipMaterialReceiveDetStock', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refRMAId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refRMADetailId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refSidId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPackingSlipId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refPackingSlipDetId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packagingId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        binId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        availableQtyAtRMA: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        availableUnitAtRMA: {
            type: Sequelize.DECIMAL,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'packing_slip_material_receive_det_stock'
    });

    PackingSlipMaterialReceiveDetStock.associate = (models) => {
        PackingSlipMaterialReceiveDetStock.belongsTo(models.PackingSlipMaterialReceiveDet, {
            foreignKey: 'refPackingSlipDetId',
            as: 'packingSlipMaterialReceiveDetStock'
        });
    };

    return PackingSlipMaterialReceiveDetStock;
};