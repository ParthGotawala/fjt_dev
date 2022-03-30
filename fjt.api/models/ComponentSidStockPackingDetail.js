const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentSidStockPackingDetail = sequelize.define('ComponentSidStockPackingDetail', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refPackingSlipDetailID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refComponentSidStockID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packingSlipQty: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
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
        isDeleted: {
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
        }
    }, {
        paranoid: true,
        tableName: 'component_sid_stock_packing_detail'
    });

    ComponentSidStockPackingDetail.associate = (models) => {
        ComponentSidStockPackingDetail.belongsTo(models.PackingSlipMaterialReceiveDet, {
            as: 'packing_slip_material_receive_det',
            foreignKey: 'refPackingSlipDetailID'
        });

        ComponentSidStockPackingDetail.belongsTo(models.ComponentSidStock, {
            as: 'component_sid_stock',
            foreignKey: 'refComponentSidStockID'
        });
    };

    return ComponentSidStockPackingDetail;
};