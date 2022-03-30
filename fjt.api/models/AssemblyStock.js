const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const AssemblyStock = sequelize.define('AssemblyStock', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        openingStock: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        openingdate: {
            allowNull: true,
            defaultValue: null,
            type: Sequelize.DATEONLY
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
        woNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        serialNo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refUMID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        whID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        binID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dateCode: {
            type: Sequelize.STRING(4),
            allowNull: true
        },
        cumulativeAssyQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        poNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dateCodeFormat: {
            type: Sequelize.STRING(5),
            allowNUll: true
        },
        poQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        soNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refSalesOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refSalesOrderID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isPOAdded: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            tableName: 'assemblystock',
            paranoid: true
        });

    AssemblyStock.associate = (models) => {
        AssemblyStock.belongsTo(models.Component, {
            as: 'componentAssembly',
            foreignKey: 'partID'
        });
        AssemblyStock.belongsTo(models.ComponentSidStock, {
            as: 'component_sid_stock',
            foreignKey: 'refUMID'
        });
        AssemblyStock.belongsTo(models.WarehouseMst, {
            as: 'warehouseMst',
            foreignKey: 'whID'
        });
        AssemblyStock.belongsTo(models.BinMst, {
            as: 'binMst',
            foreignKey: 'binID'
        });
        AssemblyStock.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        AssemblyStock.belongsTo(models.SalesOrderDet, {
            as: 'assemblySalesOrderDet',
            foreignKey: 'refSalesOrderDetID'
        });
        AssemblyStock.belongsTo(models.SalesOrderMst, {
            as: 'assemblySalesOrderMst',
            foreignKey: 'refSalesOrderID'
        });
    };

    return AssemblyStock;
};
