const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentSidStock = sequelize.define('ComponentSidStock', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        uid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refcompid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        scanlabel: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pkgQty: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        refinvno: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refinvdate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isinStk: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        printStatus: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        costCategoryID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        lotCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dateCode: {
            type: Sequelize.STRING,
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
        nickName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        prefix: {
            type: Sequelize.STRING,
            allowNull: true
        },
        uidPrefix: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        binID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        mfgDate: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        expiryDate: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        pcbPerArray: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        isSharedInventory: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        MFGorExpiryDate: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        FloorLifeExpirationTime: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        ShelfLifeExpirationTime: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        floortimeRunning: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        sealDate: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        spq: {
            type: Sequelize.DECIMAL(16, 6),
            allowNUll: true
        },
        cpn: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        refCPNMFGPNID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        mfgAvailabel: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        assyID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        stockInventoryType: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        receiveMaterialType: {
            type: Sequelize.STRING,
            allowNUll: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        uom: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        packaging: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        refSupplierPartId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        orgQty: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        fromBin: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        orgRecBin: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        pkgUnit: {
            type: Sequelize.DECIMAL(16, 6),
            allowNUll: true
        },
        orgPkgUnit: {
            type: Sequelize.DECIMAL(16, 6),
            allowNUll: true
        },
        customerConsign: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        specialNote: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        fromWarehouse: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fromDepartment: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        orgRecWarehouse: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        orgRecDepartment: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        initialQtyChangeRemark: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        refRestrictUMIDId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        isUMIDRestrict: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
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
        mfrDateCodeFormatID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfrDateCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rohsStatusID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woNumber: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woID: {
            type: Sequelize.STRING,
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
        selfLifeDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shelfLifeAcceptanceDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        maxShelfLifeAcceptanceDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isReservedStock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        dateCodeFormatID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fromDateCodeFormat: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'component_sid_stock',
            paranoid: true
        });

    ComponentSidStock.associate = (models) => {
        ComponentSidStock.hasMany(models.ComponentSidStockDataelementValues, {
            foreignKey: 'refsidid',
            as: 'componentsidstockdataelementvalues'
        });
        ComponentSidStock.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refcompid'
        });
        ComponentSidStock.belongsTo(models.Component, {
            as: 'component_cpn',
            foreignKey: 'refCPNMFGPNID'
        });
        ComponentSidStock.belongsTo(models.Component, {
            as: 'component_supplier',
            foreignKey: 'refSupplierPartId'
        });
        ComponentSidStock.hasMany(models.KitAllocation, {
            as: 'kitAllocation',
            foreignKey: 'refUIDId'
        });
        ComponentSidStock.belongsTo(models.BinMst, {
            as: 'binMst',
            foreignKey: 'binID'
        });
        ComponentSidStock.belongsTo(models.BinMst, {
            as: 'fromBinMst',
            foreignKey: 'fromBin'
        });
        ComponentSidStock.hasMany(models.ComponentSidStockRestrictUMID, {
            as: 'componentSidStockRestrictUMID',
            foreignKey: 'refUMIDId'
        });
        ComponentSidStock.belongsTo(models.DateCodeFormatMst, {
            as: 'dateCodeFormatMst',
            foreignKey: 'mfrDateCodeFormatID'
        });
        ComponentSidStock.hasMany(models.AssemblyStock, {
            foreignKey: 'refUMID',
            as: 'assemblystock'
        });
        ComponentSidStock.belongsTo(models.RFQRoHS, {
            as: 'rfqRohsMst',
            foreignKey: 'rohsStatusID'
        });
        ComponentSidStock.belongsTo(models.ComponentPackagingMst, {
            as: 'packagingmst',
            foreignKey: 'packaging'
        });
        ComponentSidStock.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        ComponentSidStock.belongsTo(models.UOMs, {
            as: 'uoms',
            foreignKey: 'uom'
        });
        ComponentSidStock.belongsTo(models.ComponentPackagingMst, {
            as: 'component_packagingmst',
            foreignKey: 'packaging'
        });
        ComponentSidStock.belongsTo(models.BinMst, {
            as: 'org_BinMst',
            foreignKey: 'orgRecBin'
        });
        ComponentSidStock.belongsTo(models.WarehouseMst, {
            as: 'from_WarehouseMst',
            foreignKey: 'fromWarehouse'
        });
        ComponentSidStock.belongsTo(models.WarehouseMst, {
            as: 'from_parent_WarehouseMst',
            foreignKey: 'fromDepartment'
        });
        ComponentSidStock.belongsTo(models.WarehouseMst, {
            as: 'org_WarehouseMst',
            foreignKey: 'orgRecWarehouse'
        });
        ComponentSidStock.belongsTo(models.WarehouseMst, {
            as: 'org_parent_WarehouseMst',
            foreignKey: 'orgRecDepartment'
        });
        ComponentSidStock.belongsTo(models.ComponentSidStock, {
            as: 'from_component_sid_stock',
            foreignKey: 'fromUIDId'
        });
        ComponentSidStock.belongsTo(models.ComponentSidStock, {
            as: 'parent_component_sid_stock',
            foreignKey: 'parentUIDId'
        });
        ComponentSidStock.hasOne(models.ComponentSidStockPackingDetail, {
            as: 'componentSidStockPackingDetail',
            foreignKey: 'refComponentSidStockID',
            sourceKey: 'id'
        });
    };

    return ComponentSidStock;
};