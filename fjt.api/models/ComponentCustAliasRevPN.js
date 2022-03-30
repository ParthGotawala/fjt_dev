const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentCustAliasRevPN = sequelize.define('ComponentCustAliasRevPN', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refCPNPartID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refComponentID: {
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
        }
    },
        {
            tableName: 'component_cust_alias_rev_pn',
            paranoid: true
        });

    ComponentCustAliasRevPN.associate = (models) => {
        ComponentCustAliasRevPN.belongsTo(models.Component, {
            as: 'ComponentCPNPart',
            foreignKey: 'refCPNPartID'
        });
        ComponentCustAliasRevPN.belongsTo(models.Component, {
            as: 'refAVLPart',
            foreignKey: 'refComponentID'
        });
    };

    return ComponentCustAliasRevPN;
};