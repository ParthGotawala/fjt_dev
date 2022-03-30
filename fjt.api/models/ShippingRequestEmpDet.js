/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ShippingRequestEmpDet = sequelize.define('ShippingRequestEmpDet', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shippingRequestID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isAck: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        acceptedDate: {
            type: Sequelize.DATE,
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
        }
    },
        {
            paranoid: true,
            tableName: 'shipping_request_empdet'
        });

    ShippingRequestEmpDet.associate = (models) => {
        ShippingRequestEmpDet.belongsTo(models.Employee, {
            foreignKey: 'employeeID',
            as: 'employee'
        });

        ShippingRequestEmpDet.belongsTo(models.ShippingRequest, {
            foreignKey: 'shippingRequestID',
            as: 'shippingRequest'
        });
    };

    return ShippingRequestEmpDet;
};