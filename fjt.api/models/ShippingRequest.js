/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ShippingRequest = sequelize.define('ShippingRequest', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        requestDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        requestedBy: {
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
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 1]
            }
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
    },
        {
            paranoid: true,
            tableName: 'shipping_request'
        });

    ShippingRequest.associate = (models) => {
        ShippingRequest.belongsTo(models.Employee, {
            foreignKey: 'requestedBy',
            as: 'employee'
        });

        ShippingRequest.hasMany(models.ShippingRequestDet, {
            foreignKey: 'shippingRequestID',
            as: 'shippingRequestDet'
        });

        ShippingRequest.hasMany(models.ShippingRequestEmpDet, {
            foreignKey: 'shippingRequestID',
            as: 'shippingRequestEmpDet'
        });
    };

    return ShippingRequest;
};