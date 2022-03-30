/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentSidStockDataelementValues = sequelize.define('ComponentSidStockDataelementValues', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refsidid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        entityid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        dataelementid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        value: {
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
        tableName: 'component_sid_stock_dataelement_values'
    });

    ComponentSidStockDataelementValues.associate = (models) => {
        ComponentSidStockDataelementValues.belongsTo(models.ComponentSidStock, {
            as: 'componentsidstockdataelementvalues',
            foreignKey: 'refsidid'
        });
    };

    return ComponentSidStockDataelementValues;
};
