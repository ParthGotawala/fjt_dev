/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQMountingType = sequelize.define('RFQMountingType', {
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
                len: [1, 255]
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
            type: Sequelize.BOOLEAN
        },
        colorCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isCountTypeEach: {
            type: Sequelize.BOOLEAN
        },
        numberOfPrintForUMID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        },
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        hasLimitedShelfLife: {
            type: Sequelize.BOOLEAN
        }
    },
        {
            tableName: 'rfq_mountingtypemst',
            paranoid: true
        }
    );

    RFQMountingType.associate = (models) => {
        RFQMountingType.hasMany(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLineItem',
            foreignKey: 'partClassID'
        });
        RFQMountingType.hasMany(models.ComponentLogicalgroupDetail, {
            as: 'componentLogicalgroupDetail',
            foreignKey: 'rfqMountingTypeID'
        });
        RFQMountingType.hasMany(models.ComponentRequireMountingType, {
            as: 'component_requiremountingtype',
            foreignKey: 'partTypeID'
        });
        RFQMountingType.hasMany(models.Component, {
            as: 'component',
            foreignKey: 'mountingTypeID'
        });
        RFQMountingType.hasMany(models.ECORequest, {
            as: 'ecodfmRequest',
            foreignKey: 'mountingTypeID'
        });
        RFQMountingType.hasMany(models.Operation, {
            as: 'operations',
            foreignKey: 'mountingTypeID'
        });
        RFQMountingType.hasMany(models.WorkorderOperation, {
            as: 'WorkorderOperations',
            foreignKey: 'mountingTypeID'
        });
    };

    return RFQMountingType;
};
