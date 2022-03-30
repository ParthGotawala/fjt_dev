const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentAcceptableShippingCountries = sequelize.define('ComponentAcceptableShippingCountries', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refComponentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        countryID: {
            type: Sequelize.INTEGER,
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
        deletedAt: {
            type: Sequelize.DATE,
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
        paranoid: true,
        tableName: 'component_acceptable_shipping_countries'
    });

    ComponentAcceptableShippingCountries.associate = (models) => {
        ComponentAcceptableShippingCountries.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
        ComponentAcceptableShippingCountries.belongsTo(models.CountryMst, {
            as: 'country',
            foreignKey: 'countryID'
        });
    };

    return ComponentAcceptableShippingCountries;
};