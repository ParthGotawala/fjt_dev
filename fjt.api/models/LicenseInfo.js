const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const LicenseInfo = sequelize.define('LicenseInfo', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        companyName: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        clientAPIUrl: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        deletedAt: {
            allowNull: true,
            defaultValue: null,
            type: Sequelize.DATE
        },
        clientToken: {
            type: Sequelize.INTEGER(11),
            allowNull: false
        },
        clientId: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        client_secret: {
            type: Sequelize.STRING(80),
            allowNull: false
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
            tableName: 'license_info',
            paranoid: true
        });

    return LicenseInfo;
};
