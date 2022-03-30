/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ExternalPartVerificationRequestLog = sequelize.define('ExternalPartVerificationRequestLog', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        partNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        supplier: {
            type: Sequelize.STRING,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        modifiedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        errorMsg: {
            type: Sequelize.STRING,
            allowNull: true
        },
        transactionID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isPartVerificationStop: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        timestamps: false,
        tableName: 'external_partverificationrequest_log'
    });
    return ExternalPartVerificationRequestLog;
};
