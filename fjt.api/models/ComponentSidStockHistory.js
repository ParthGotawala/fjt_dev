const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentSidStockHistory = sequelize.define('ComponentSidStockHistory', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        transType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        actionPerformed: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refUIDId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        uid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refcompid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        binID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        warehouseID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        deptWHID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        orgQty: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        orgUnit: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        currentQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        currentUnit: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        uom: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        scarppedQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        scrappedUnit: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        consumedQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        consumedUnit: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        adjustQty: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        adjustUnit: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        refTrans: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refTransTable: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refSalesOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        userInputDetail: {
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
        isApproved: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deallocatedKitDesc: {
            type: Sequelize.STRING,
            allowNull: true
        },
        approvalReason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        approvedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        approvedByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fromUIDId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fromUID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        parentUIDId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        parentUID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        splitUIDId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        splitUID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        splitQty: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        splitUnit: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        }
    }, {
        tableName: 'component_sid_stock_history',
        paranoid: true
    });

    ComponentSidStockHistory.associate = (models) => {
        ComponentSidStockHistory.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refcompid'
        });

        ComponentSidStockHistory.belongsTo(models.BinMst, {
            as: 'binmst',
            foreignKey: 'binID'
        });

        ComponentSidStockHistory.belongsTo(models.ComponentSidStock, {
            as: 'component_sid_stock',
            foreignKey: 'refUIDId'
        });
    };

    return ComponentSidStockHistory;
};