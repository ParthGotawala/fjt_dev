const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQBomHeaderComponentConfiguration = sequelize.define('RFQBomHeaderComponentConfiguration', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refComponentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refHeaderID: {
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
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            tableName: 'rfq_bom_header_component_configuration',
            paranoid: true
        }
    );

    RFQBomHeaderComponentConfiguration.associate = (models) => {
        RFQBomHeaderComponentConfiguration.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
        RFQBomHeaderComponentConfiguration.belongsTo(models.RFQLineItemsHeaders, {
            as: 'rfq_lineItems_headers',
            foreignKey: 'refHeaderID'
        });
    };

    return RFQBomHeaderComponentConfiguration;
};
