/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQPriceGroup = sequelize.define('RFQPriceGroup', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refRFQID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING
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
        tableName: 'rfq_price_group'
    });

    RFQPriceGroup.associate = (models) => {
        RFQPriceGroup.belongsTo(models.RFQForms, {
            as: 'rfqForms',
            foreignKey: 'refRFQID'
        });

        RFQPriceGroup.hasMany(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'rfqPriceGroupID'
        });
        RFQPriceGroup.hasMany(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'rfqPriceGroupId'
        });
        RFQPriceGroup.hasMany(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotation',
            foreignKey: 'rfqPriceGroupId'
        });
        RFQPriceGroup.hasMany(models.RFQAssyQtyWiseBOMLaborCostingDetail, {
            as: 'rfqAssyQtyWiseBOMLaborCostingDetail',
            foreignKey: 'rfqPriceGroupId'
        });
    };

    return RFQPriceGroup;
};