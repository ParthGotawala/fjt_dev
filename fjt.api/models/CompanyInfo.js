const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CompanyInfo = sequelize.define('CompanyInfo', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        personName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        registeredEmail: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contactCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        contactNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        faxCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        faxNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phoneExt: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        street1: {
            type: Sequelize.STRING,
            allowNull: true
        },
        street2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        street3: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true
        },
        postalCode: {
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
        mfgCodeId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        countryID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        unitOfTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        companyLogo: {
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
        },
        ein: {
            type: Sequelize.STRING,
            allowNull: true
        },
        remittanceAddress: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        legalName: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'company_info'
        });

    CompanyInfo.associate = (models) => {
        CompanyInfo.belongsTo(models.CountryMst, {
            as: 'countryMst',
            foreignKey: 'countryID'
        });
        CompanyInfo.belongsTo(models.MfgCodeMst, {
            as: 'MfgCodeMst',
            foreignKey: 'mfgCodeId'
        });
    };

    return CompanyInfo;
};