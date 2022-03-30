const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CountryMst = sequelize.define('CountryMst', {
        countryID: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        countryName: {
            type: Sequelize.STRING,
            allowNUll: false
        },
        flagImageExtention: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        countrySortCode: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        imageName: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
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
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        }
    },
        {
            tableName: 'countryMst',
            paranoid: true
        });

    CountryMst.associate = (models) => {
        CountryMst.hasMany(models.ComponentFieldsGenericaliasMst, {
            as: 'componentFieldsGenericaliasMst',
            foreignKey: 'refId'
        });
        CountryMst.hasMany(models.ComponentAcceptableShippingCountries, {
            as: 'Component_Acceptable_Shipping_Countries',
            foreignKey: 'countryID'
        });
    };

    return CountryMst;
};