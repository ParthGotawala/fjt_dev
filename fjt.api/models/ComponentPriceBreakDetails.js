const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentPriceBreakDetails = sequelize.define('ComponentPriceBreakDetails', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        mfgPNID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        priceBreak: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        unitPrice: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedOn: {
            type: Sequelize.DATE,
            allowNull: false
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
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
        type: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        turnTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        unitOfTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        salesCommissionPercentage: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        salesCommissionAmount: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        salesCommissionNotes: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        rfqNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isHistory: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'component_price_break_details'
    });

    ComponentPriceBreakDetails.associate = (models) => {
        ComponentPriceBreakDetails.belongsTo(models.Component, {
            as: 'mfgPN',
            foreignKey: 'mfgPNID'
        });
        ComponentPriceBreakDetails.hasMany(models.SalesOrderDet, {
            as: 'SalesOrderDet',
            foreignKey: 'refAssyQtyTurnTimeID'
        });
        ComponentPriceBreakDetails.hasMany(models.SalesorderdetCommissionAttribute, {
            as: 'SalesorderdetCommissionAttribute',
            foreignKey: 'refComponentSalesPriceBreakID'
        });
    };

    return ComponentPriceBreakDetails;
};