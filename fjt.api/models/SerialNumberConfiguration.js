const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SerialNumberConfiguration = sequelize.define('SerialNumberConfiguration', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nickname: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        partId: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        configurationLevel: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        isConsecutiveNumber: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        prefix: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        prefixLock: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        noofDigits: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        lastMaxNumber: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        assyDateCode: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        assyDateCodeFormat: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        startNumber: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        suffix: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        suffixLock: {
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
        },
        barcodeSeparatorID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        barcodeSeparatorLock: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        }
    }, {
        tableName: 'serial_number_configuration',
        paranoid: false
    });
    return SerialNumberConfiguration;
};