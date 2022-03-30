/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQPriceGroupDetail = sequelize.define('RFQPriceGroupDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqPriceGroupID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        refRFQID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        rfqAssyID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        qty: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        turnTime: {
            allowNull: false,
            type: Sequelize.STRING
        },
        unitOfTime: {
            allowNull: false,
            type: Sequelize.STRING,
            validate: {
                notEmpty: false,
                len: [0, 1]
            }
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
        tableName: 'rfq_price_group_detail'
    });

    RFQPriceGroupDetail.associate = (models) => {
        RFQPriceGroupDetail.belongsTo(models.RFQForms, {
            as: 'rfqForms',
            foreignKey: 'refRFQID'
        });

        RFQPriceGroupDetail.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });

        RFQPriceGroupDetail.belongsTo(models.RFQPriceGroup, {
            as: 'rfqPriceGroup',
            foreignKey: 'rfqPriceGroupID'
        });
        RFQPriceGroupDetail.hasMany(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'rfqPriceGroupDetailId'
        });
        RFQPriceGroupDetail.hasMany(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotation',
            foreignKey: 'rfqPriceGroupDetailId'
        });
        RFQPriceGroupDetail.hasMany(models.RFQAssyQtyWiseBOMLaborCostingDetail, {
            as: 'rfqAssyQtyWiseBOMLaborCostingDetail',
            foreignKey: 'rfqPriceGroupDetailId'
        });
    };

    return RFQPriceGroupDetail;
};