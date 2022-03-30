/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SmartCartTransaction = sequelize.define('SmartCartTransaction', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        smartCartLedColorID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        messageType: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        startDate: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        endDate: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        requestMessage: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        responseMessage: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        responseStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reelBarCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        transactionID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        towareHouseID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        refUMIDId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        isfromSystem: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        refDepartmentID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        illegalPick: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isInTransit: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        toBinID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        unAuthorizeAction: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        clearUnauthorizeRequstReason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        clearBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        clearedAt: {
            type: Sequelize.DATE,
            allowNUll: true
        },
        isClearRequest: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        pickColorUserID: {
            type: Sequelize.INTEGER,
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
        }
    }, {
        tableName: 'smartcarttransaction',
        paranoid: true
    });

    SmartCartTransaction.associate = (models) => {
        SmartCartTransaction.belongsTo(models.SmartCartLEDColorMst, {
            as: 'smartCartLedColorMst',
            foreignKey: 'smartCartLedColorID'
        });
    };

    return SmartCartTransaction;
};