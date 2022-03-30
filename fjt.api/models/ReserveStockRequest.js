const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReserveStockRequest = sequelize.define('ReserveStockRequest', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        nickName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        assyID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        transactionDate: {
            type: Sequelize.DATEONLY,
            allowNUll: true
        },
        count: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        unit: {
            type: Sequelize.DECIMAL,
            allowNUll: true
        },
        uom: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        description: {
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
            tableName: 'reserve_stock_request',
            paranoid: true
        });

    ReserveStockRequest.associate = (models) => {
        ReserveStockRequest.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });

        ReserveStockRequest.belongsTo(models.Component, {
            as: 'assembly',
            foreignKey: 'assyID'
        });

        ReserveStockRequest.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'customerID'
        });
    };

    return ReserveStockRequest;
};