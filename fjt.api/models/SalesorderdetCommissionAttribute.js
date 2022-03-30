/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SalesorderdetCommissionAttribute = sequelize.define('SalesorderdetCommissionAttribute', {
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
        refQuoteAttributeId: {
            type: Sequelize.INTEGER,
            allowNull: true
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
        org_commissionPercentage: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        org_commissionValue: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        category: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refSalesCommissionID: {
            type: Sequelize.INTEGER,
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
        org_unitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'salesorderdet_commission_attribute'
    });

    SalesorderdetCommissionAttribute.associate = (models) => {
        SalesorderdetCommissionAttribute.belongsTo(models.SalesOrderDet, {
            as: 'salesorderDet',
            foreignKey: 'refSalesorderdetID'
        });

        SalesorderdetCommissionAttribute.belongsTo(models.QuoteDynamicFields, {
            as: 'quoteDynamicFields',
            foreignKey: 'refQuoteAttributeId'
        });
        SalesorderdetCommissionAttribute.belongsTo(models.ComponentPriceBreakDetails, {
            as: 'ComponentPriceBreakDetails',
            foreignKey: 'refComponentSalesPriceBreakID'
        });
        SalesorderdetCommissionAttribute.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
        SalesorderdetCommissionAttribute.belongsTo(models.SalesorderdetCommissionAttributeMstDet, {
            as: 'salesorderDetCommissionAttributeMstDet',
            foreignKey: 'refSalesCommissionID'
        });
    };

    return SalesorderdetCommissionAttribute;
};
