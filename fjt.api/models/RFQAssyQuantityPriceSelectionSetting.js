const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuantityPriceSelectionSetting = sequelize.define('RFQAssyQuantityPriceSelectionSetting', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        qtyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isCheckRequiredQty: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isLeadTime: {
            type: Sequelize.BOOLEAN,
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
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        stockPercentage: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        packagingID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rfqPriceGroupId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        rfqPriceGroupDetailId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        settingType: {
            allowNull: false,
            type: Sequelize.STRING
        },
        leadTime: {
            allowNull: true,
            type: Sequelize.DECIMAL(10, 1)
        }
    },
        {
            tableName: 'rfq_assy_quantity_price_selection_setting',
            paranoid: true
        });

    RFQAssyQuantityPriceSelectionSetting.associate = (models) => {
        RFQAssyQuantityPriceSelectionSetting.belongsTo(models.RFQAssyQuantity, {
            foreignKey: 'qtyID',
            as: 'rfqAssyQuantity'
        });
        RFQAssyQuantityPriceSelectionSetting.belongsTo(models.ComponentPackagingMst, {
            foreignKey: 'packagingID',
            as: 'componentPackagingMst'
        });
        RFQAssyQuantityPriceSelectionSetting.belongsTo(models.RFQPriceGroup, {
            as: 'rfqPriceGroup',
            foreignKey: 'rfqPriceGroupId'
        });
        RFQAssyQuantityPriceSelectionSetting.belongsTo(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'rfqPriceGroupDetailId'
        });
    };

    return RFQAssyQuantityPriceSelectionSetting;
};
