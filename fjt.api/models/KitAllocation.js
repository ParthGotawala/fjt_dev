const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const KitAllocation = sequelize.define('KitAllocation', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refSalesOrderDetID: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        assyID: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        refBOMLineID: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        refUIDId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        uid: {
            type: Sequelize.STRING,
            allowNUll: false
        },
        partId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        transactionDate: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        status: {
            type: Sequelize.STRING,
            allowNUll: false
        },
        allocatedQty: {
            type: Sequelize.DOUBLE,
            allowNUll: true
        },
        allocatedUnit: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        allocatedUOM: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        consumeQty: {
            type: Sequelize.DOUBLE,
            allowNUll: true
        },
        consumeUnit: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        consumeUOM: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        returnQty: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        returnUnit: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        returnUOM: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        scrapExpiredQty: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        scrapExpiredUnit: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        scrapExpiredUOM: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        returnDate: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        outQty: {
            type: Sequelize.DOUBLE,
            allowNUll: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        allocationRemark: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        roHSApprovalReason: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        roHSApprovedBy: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        roHSApprovedOn: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedBy: {
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
        }
    }, {
        tableName: 'kit_allocation',
        paranoid: false
    });

    KitAllocation.associate = (models) => {
        KitAllocation.belongsTo(models.SalesOrderDet, {
            as: 'salesorderdetatil',
            foreignKey: 'refSalesOrderDetID'
        });
        KitAllocation.belongsTo(models.Component, {
            as: 'AssemblyDetail',
            foreignKey: 'assyID'
        });
        KitAllocation.belongsTo(models.ComponentSidStock, {
            as: 'ComponentSidStock',
            foreignKey: 'uid'
        });
        KitAllocation.belongsTo(models.UOMs, {
            as: 'AllocatedUOM',
            foreignKey: 'allocatedUOM'
        });
        KitAllocation.belongsTo(models.SalesOrderPlanDetailsMst, {
            as: 'salesorder_plan_detailsmst',
            foreignKey: 'kitReleaseID'
        });
        KitAllocation.belongsTo(models.Workorder, {
            as: 'Workorder',
            foreignKey: 'woID'
        });
    };

    return KitAllocation;
};