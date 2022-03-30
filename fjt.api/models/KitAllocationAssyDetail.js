/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const KitAllocationAssyDetail = sequelize.define('KitAllocationAssyDetail', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        partId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refSalesOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        perAssyBuildQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        totalAssyBuildQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        kitQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        bomInternalVersion: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        bomInternalVersionString: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bomAssyLevel: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        paranoid: true,
        tableName: 'kit_allocation_assy_detail'
    });

    KitAllocationAssyDetail.associate = (models) => {
        KitAllocationAssyDetail.belongsTo(models.Component, {
            as: 'kit_allocation_component',
            foreignKey: 'partId'
        });

        KitAllocationAssyDetail.belongsTo(models.SalesOrderDet, {
            as: 'salesorderdetatil',
            foreignKey: 'refSalesOrderDetID'
        });
    };

    return KitAllocationAssyDetail;
};