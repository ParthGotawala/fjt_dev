const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineItemsHeaders = sequelize.define('RFQLineItemsHeaders', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        field: {
            type: Sequelize.STRING,
            allowNull: false
        },
        displayOrder: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            tableName: 'RFQ_LineItems_Headers',
            paranoid: true
        }
    );
    return RFQLineItemsHeaders;
};