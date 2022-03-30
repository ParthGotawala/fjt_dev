const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderSalesOrderDetails = sequelize.define('WorkorderSalesOrderDetails', {
        woSalesOrderDetID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        salesOrderDetailID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        poQty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        scrapQty: {
            type: Sequelize.INTEGER,
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
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        parentPartID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qpa: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'workorder_salesorder_details',
            paranoid: true
        });

    WorkorderSalesOrderDetails.associate = (models) => {
        WorkorderSalesOrderDetails.belongsTo(models.SalesOrderDet, {
            as: 'SalesOrderDetails',
            foreignKey: 'salesOrderDetailID'
        });
        WorkorderSalesOrderDetails.belongsTo(models.Workorder, {
            as: 'WoSalesOrderDetails',
            foreignKey: 'woID'
        });
    };


    return WorkorderSalesOrderDetails;
};