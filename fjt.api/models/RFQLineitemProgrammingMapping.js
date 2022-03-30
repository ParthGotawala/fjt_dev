const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineItemsProgrammingMapping = sequelize.define('RFQLineItemsProgrammingMapping', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqLineItemID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        softwareRFQLineItemID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partRefDesg: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        softwareRefDesg: {
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
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
        tableName: 'rfq_lineitem_programming_mapping'
    });

    RFQLineItemsProgrammingMapping.associate = (models) => {
        RFQLineItemsProgrammingMapping.belongsTo(models.RFQLineItems, {
            as: 'partRefDesgLineItem',
            foreignKey: 'rfqLineItemID'
        });

        RFQLineItemsProgrammingMapping.belongsTo(models.RFQLineItems, {
            as: 'softwareRefDesgLineItem',
            foreignKey: 'softwareRFQLineItemID'
        });

        RFQLineItemsProgrammingMapping.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
    };
    return RFQLineItemsProgrammingMapping;
};
