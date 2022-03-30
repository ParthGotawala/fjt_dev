/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SalesOrderDet = sequelize.define('SalesOrderDet', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refSalesOrderID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        shippingQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mrpQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        materialTentitiveDocDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        prcNumberofWeek: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isHotJob: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        materialDueDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        isCancle: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        cancleReason: {
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
        uom: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        tentativeBuild: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lineID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        kitQty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        kitNumber: {
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
        salesCommissionTo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refRFQGroupID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refRFQQtyTurnTimeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        custPOLineNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partCategory: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isSkipKitCreation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isCustomerConsign: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        partDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        quoteNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        salesOrderDetStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        completeStatusReason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        quoteFrom: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refAssyQtyTurnTimeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyQtyTurnTimeText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        internalComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        frequency: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refSODetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refSOReleaseLineID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        originalPOQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        frequencyType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refBlanketPOID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        releaseLevelComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        woComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        custOrgPOLineNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        requestedBPOStartDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        blanketPOEndDate: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'salesorderdet'
    });

    SalesOrderDet.associate = (models) => {
        SalesOrderDet.belongsTo(models.SalesOrderMst, {
            as: 'salesOrderMst',
            foreignKey: 'refSalesOrderID'
        });
        SalesOrderDet.hasMany(models.SalesShippingMst, {
            as: 'salesShippingDet',
            foreignKey: 'sDetID'
        });
        SalesOrderDet.hasMany(models.WorkorderSalesOrderDetails, {
            as: 'SalesOrderDetails',
            foreignKey: 'salesOrderDetailID'
        });
        SalesOrderDet.belongsTo(models.Component, {
            as: 'componentAssembly',
            foreignKey: 'partID'
        });
        SalesOrderDet.belongsTo(models.UOMs, {
            as: 'UOMs',
            foreignKey: 'uom'
        });
         SalesOrderDet.hasMany(models.SalesorderdetCommissionAttribute, {
             as: 'salesorderdetCommissionAttribute',
             foreignKey: 'refSalesorderdetID'
         });
        SalesOrderDet.hasMany(models.SalesorderdetCommissionAttributeMstDet, {
            as: 'salesorderdetCommissionAttributeMstDet',
            foreignKey: 'refSalesorderdetID'
        });
        SalesOrderDet.belongsTo(models.Employee, {
            as: 'employees',
            foreignKey: 'salesCommissionTo'
        });
        SalesOrderDet.belongsTo(models.RFQForms, {
            as: 'rfqForms',
            foreignKey: 'refRFQGroupID'
        });
        SalesOrderDet.belongsTo(models.RFQAssyQuantityTurnTime, {
            as: 'rfqAssyQuantityTurnTime',
            foreignKey: 'refRFQQtyTurnTimeID'
        });
         SalesOrderDet.hasMany(models.CustomerPackingSlipDet, {
             as: 'customerPackingSlipDet',
             foreignKey: 'refSalesorderDetid'
         });
         SalesOrderDet.hasMany(models.SalesOrderOtherExpenseDetail, {
             as: 'salesOrderOtherExpenseDetails',
             foreignKey: 'refSalesOrderDetID'
         });
        SalesOrderDet.belongsTo(models.ComponentPriceBreakDetails, {
            as: 'ComponentPriceBreakDetails',
            foreignKey: 'refAssyQtyTurnTimeID'
        });
        SalesOrderDet.hasMany(models.AssemblyStock, {
            as: 'InitialStock',
            foreignKey: 'refSalesOrderDetID'
        });
        SalesOrderDet.belongsTo(models.SalesOrderDet, {
            as: 'salesOrderBlanketPO',
            foreignKey: 'refBlanketPOID'
        });
        SalesOrderDet.hasMany(models.SalesOrderDet, {
            as: 'salesOrderBlanketPODet',
            foreignKey: 'refBlanketPOID'
        });
    };

    return SalesOrderDet;
};