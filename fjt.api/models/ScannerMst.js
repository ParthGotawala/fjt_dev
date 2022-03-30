const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ScannerMst = sequelize.define('ScannerMst', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ipAddress: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        nodename: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        usbModelName: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        make: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        model: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        version: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        location: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        macAddress: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
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
        tableName: 'scannermst',
        paranoid: true
    });
    return ScannerMst;
};