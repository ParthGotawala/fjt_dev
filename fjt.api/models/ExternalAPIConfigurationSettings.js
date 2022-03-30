/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ExternalAPIConfigurationSettings = sequelize.define('ExternalAPIConfigurationSettings', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        supplierID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        clientID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        secretID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refreshToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        accessToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        specialPriceCustomerID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        perCallRecordCount: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        appID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        defaultAccess: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        redirectUrl: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dkCallLimit: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        Version: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        timestamps: false,
        tableName: 'external_api_configuration_settings'
    });
    return ExternalAPIConfigurationSettings;
};
