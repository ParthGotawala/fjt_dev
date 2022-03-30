/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SalesorderdetCommissionAttributeMstDet = sequelize.define('SalesorderdetCommissionAttributeMstDet', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refSalesorderdetID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refComponentSalesPriceBreakID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        unitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        commissionPercentage: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        commissionValue: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        quoted_commissionPercentage: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        quoted_commissionValue: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        poQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        quotedQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        commissionCalculateFrom: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        salesCommissionNotes: {
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
        },
        quoted_unitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
            tableName: 'salesorderdet_commission_attribute_mstdet'
    });

    SalesorderdetCommissionAttributeMstDet.associate = (models) => {
        SalesorderdetCommissionAttributeMstDet.belongsTo(models.SalesOrderDet, {
            as: 'commissionSalesorderDet',
            foreignKey: 'refSalesorderdetID'
        });
        SalesorderdetCommissionAttributeMstDet.belongsTo(models.ComponentPriceBreakDetails, {
            as: 'commissionComponentPriceBreakDetails',
            foreignKey: 'refComponentSalesPriceBreakID'
        });
        SalesorderdetCommissionAttributeMstDet.belongsTo(models.Component, {
            as: 'commissionComponent',
            foreignKey: 'partID'
        });
        SalesorderdetCommissionAttributeMstDet.hasMany(models.SalesorderdetCommissionAttribute, {
            as: 'commissionSalesorderdetCommissionAttribute',
            foreignKey: 'refSalesCommissionID'
        });
    };

    return SalesorderdetCommissionAttributeMstDet;
};
