const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WarehouseMst = sequelize.define('WarehouseMst', {
        ID: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        Name: {
            type: Sequelize.STRING,
            allowNUll: false
        },
        Description: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        nickname: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        parentWHID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        isPermanentWH: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
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
        isDepartment: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        uniqueCartID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        scanWH: {
            type: Sequelize.STRING,
            allowNull: true
        },
        scanBin: {
            type: Sequelize.STRING,
            allowNull: true
        },
        allMovableBin: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        userAccessMode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        domain: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cartMfr: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cartMachineName: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refEqpID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        warehouseType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isCartOnline: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        slotCount: {
            type: Sequelize.INTEGER,
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
        leftSideWHLabel: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rightSideWHLabel: {
            type: Sequelize.STRING,
            allowNull: true
        },
        leftSideWHRows: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rightSideWHRows: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'warehousemst',
            paranoid: true
        }
    );

    WarehouseMst.associate = (models) => {
        WarehouseMst.hasMany(models.BinMst, {
            as: 'binMst',
            foreignKey: 'WarehouseID'
        });
        WarehouseMst.belongsTo(models.WarehouseMst, {
            foreignKey: 'parentWHID',
            as: 'parentWarehouseMst'
        });
        WarehouseMst.hasMany(models.CustomerPackingSlipDet, {
            as: 'customerPackingSlipDet',
            foreignKey: 'whID'
        });
        WarehouseMst.hasMany(models.AssemblyStock, {
            as: 'assemblyStock',
            foreignKey: 'whID'
        });
    };

    return WarehouseMst;
};