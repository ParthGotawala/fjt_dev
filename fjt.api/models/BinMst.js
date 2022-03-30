const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const BinMst = sequelize.define('BinMst', {
        id: {
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
        WarehouseID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        nickname: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        isPermanentBin: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
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
        isRandom: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        prefix: {
            type: Sequelize.STRING,
            allowNull: true
        },
        suffix: {
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
        smartCartSide: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'binMst',
        paranoid: true
    });

    BinMst.associate = (models) => {
        BinMst.belongsTo(models.WarehouseMst, {
            as: 'warehousemst',
            foreignKey: 'WarehouseID'
        });
        BinMst.hasMany(models.Equipment, {
            foreignKey: 'binId',
            as: 'equipment'
        });
        BinMst.hasMany(models.CustomerPackingSlipDet, {
            foreignKey: 'binID',
            as: 'customerPackingSlipDet'
        });
        BinMst.hasMany(models.AssemblyStock, {
            foreignKey: 'binID',
            as: 'assemblyStock'
        });
    };

    return BinMst;
};