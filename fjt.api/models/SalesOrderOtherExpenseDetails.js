const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SalesOrderOtherExpenseDetail = sequelize.define('SalesOrderOtherExpenseDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refSalesOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        price: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: true
        },
        frequency: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lineComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lineInternalComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        frequencyType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refReleaseLineID: {
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
        }
    },
        {
            tableName: 'salesorder_otherexpense_details',
            paranoid: true
        });

    SalesOrderOtherExpenseDetail.associate = (models) => {
        SalesOrderOtherExpenseDetail.belongsTo(models.SalesOrderDet, {
            foreignKey: 'refSalesOrderDetID',
            as: 'salesOrderDet'
        });
        SalesOrderOtherExpenseDetail.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'component'
        });
    };


    return SalesOrderOtherExpenseDetail;
};
