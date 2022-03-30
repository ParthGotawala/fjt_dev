const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQtyWiseBOMLaborCostingDetail = sequelize.define('RFQAssyQtyWiseBOMLaborCostingDetail', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        rfqAssyQtyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqAssyBOMMountingID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        perAssyPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        overHeadPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        overHeadAssyPrice: {
            type: Sequelize.DECIMAL(16, 6),
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isPricePending: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        rfqPriceGroupId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        rfqPriceGroupDetailId: {
            allowNull: true,
            type: Sequelize.INTEGER
        }
    },
        {
            paranoid: true,
            tableName: 'rfq_assy_QtyWise_bom_laborcosting_detail'
        });

    RFQAssyQtyWiseBOMLaborCostingDetail.associate = (models) => {
        RFQAssyQtyWiseBOMLaborCostingDetail.belongsTo(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'rfqAssyQtyID'
        });
        RFQAssyQtyWiseBOMLaborCostingDetail.belongsTo(models.RFQAssyLaborBOMMountingTypeQPADetail, {
            as: 'rfqAssyLaborBOMMountingTypeQPA',
            foreignKey: 'rfqAssyBOMMountingID'
        });
        RFQAssyQtyWiseBOMLaborCostingDetail.belongsTo(models.RFQPriceGroup, {
            as: 'rfqPriceGroup',
            foreignKey: 'rfqPriceGroupId'
        });
        RFQAssyQtyWiseBOMLaborCostingDetail.belongsTo(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'rfqPriceGroupDetailId'
        });
    };

    return RFQAssyQtyWiseBOMLaborCostingDetail;
};