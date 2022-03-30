/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQConnecterType = sequelize.define('RFQConnecterType', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 250]
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN,
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
        systemGenerated: {
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
    },
        {
            tableName: 'rfq_connectertypemst',
            paranoid: true
        }
    );

    RFQConnecterType.associate = (models) => {
        RFQConnecterType.hasMany(models.Component, {
            as: 'component',
            foreignKey: 'connecterTypeID'
        });
        RFQConnecterType.hasMany(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLineItem',
            foreignKey: 'partClassID'
        });
    };

    return RFQConnecterType;
};
