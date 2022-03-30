const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentSidStockRestrictUMID = sequelize.define('ComponentSidStockRestrictUMID', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refUMIDId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        restrictType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reasonForRestrict: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        transactionDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        restrictBy: {
            type: Sequelize.STRING,
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
        tableName: 'component_sid_stock_restrict_umid',
        paranoid: true
    });

    ComponentSidStockRestrictUMID.associate = (models) => {
        ComponentSidStockRestrictUMID.belongsTo(models.ComponentSidStock, {
            as: 'componentSidStock',
            foreignKey: 'refUMIDId'
        });
    };

    return ComponentSidStockRestrictUMID;
};