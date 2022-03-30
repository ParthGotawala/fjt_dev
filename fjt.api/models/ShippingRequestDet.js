/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ShippingRequestDet = sequelize.define('ShippingRequestDet', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        shippingRequestID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        note: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 500]
            }
        },
        qty: {
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
        }
    },
        {
            paranoid: true,
            tableName: 'shipping_requestdet'
        });

    ShippingRequestDet.associate = (models) => {
        ShippingRequestDet.belongsTo(models.ShippingRequest, {
            foreignKey: 'shippingRequestID',
            as: 'shippingRequest'
        });

        ShippingRequestDet.belongsTo(models.Workorder, {
            foreignKey: 'woID',
            as: 'workorder'
        });
    };

    return ShippingRequestDet;
};