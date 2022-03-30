/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SalesOrderPlanDetailsMst = sequelize.define('SalesOrderPlanDetailsMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        salesOrderDetID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        refAssyId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        subAssyID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        poQty: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        poDueDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        materialDockDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        kitReleaseQty: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        mfrLeadTime: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        kitReleaseDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        plannKitNumber: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        actualKitReleaseDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        releasedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        releaseTimeFeasibility: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        kitStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        woID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        refPlanId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        releasedNote: {
            type: Sequelize.STRING,
            allowNull: true
        },
        releaseKitNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        kitReturnStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        kitReturnDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        kitReturnBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        initiateReturnBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        initiateReturnAt: {
            type: Sequelize.DATE,
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
        }
    }, {
        tableName: 'salesorder_plan_detailsmst',
        paranoid: true
    });

    SalesOrderPlanDetailsMst.associate = (models) => {
        SalesOrderPlanDetailsMst.belongsTo(models.SalesOrderDet, {
            foreignKey: 'salesOrderDetID',
            as: 'salesOrder_Det'
        });

        SalesOrderPlanDetailsMst.belongsTo(models.Workorder, {
            foreignKey: 'woID',
            as: 'workorder'
        });
    };

    return SalesOrderPlanDetailsMst;
};