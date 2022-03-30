/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQPartType = sequelize.define('RFQPartType', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partTypeName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isTemperatureSensitive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
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
            tableName: 'rfq_parttypemst',
            paranoid: true
        }
    );

    RFQPartType.associate = (models) => {
        RFQPartType.hasMany(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLineItem',
            foreignKey: 'partTypeID'
        });
        RFQPartType.hasMany(models.Component, {
            as: 'component',
            foreignKey: 'functionalCategoryID'
        });
        RFQPartType.hasMany(models.ComponentRequireFunctionalType, {
            as: 'component_requirefunctionaltype',
            foreignKey: 'partTypeID'
        });
        RFQPartType.hasMany(models.ComponentAlternatePNValidations, {
            as: 'component_alternatepn_validations',
            foreignKey: 'refRfqPartTypeId'
        });
    };

    return RFQPartType;
};
