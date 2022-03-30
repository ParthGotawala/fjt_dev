/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SmartCartLEDColorMst = sequelize.define('SmartCartLEDColorMst', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        cartMfr: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        ledColorValue: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        ledColorName: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        ledColorCssClass: {
            type: Sequelize.STRING,
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
        tableName: 'smartcartledcolormst',
        paranoid: true
    });

    SmartCartLEDColorMst.associate = (models) => {
        SmartCartLEDColorMst.hasMany(models.SmartCartTransaction, {
            as: 'smartCartTransaction',
            foreignKey: 'smartCartLedColorID'
        });
    };

    return SmartCartLEDColorMst;
};