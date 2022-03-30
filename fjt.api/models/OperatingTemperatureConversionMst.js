/* eslint-disable global-require */
module.exports = (sequelize) => {
    const Sequelize = require('sequelize');
    const OperatingTemperatureConversionMst = sequelize.define('OperatingTemperatureConversionMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        externalTemperatureValue: {
            type: Sequelize.STRING,
            allowNull: false
        },
        minTemperature: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        maxTemperature: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        tableName: 'operating_temperature_conversion_mst'
    });
    return OperatingTemperatureConversionMst;
};