const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ECORequestTypeValues = sequelize.define('ECORequestTypeValues', {
        ecoReqTypeValID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ecoReqID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        ecoTypeCatID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        ecoTypeValID: {
            allowNull: false,
            type: Sequelize.INTEGER
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
        note: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
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
            tableName: 'eco_request_type_values'
        });

    ECORequestTypeValues.associate = (models) => {
        ECORequestTypeValues.belongsTo(models.ECOTypeCategory, {
            as: 'ecoTypeCategory',
            foreignKey: 'ecoTypeCatID'
        });
        ECORequestTypeValues.belongsTo(models.ECORequest, {
            as: 'ecoRequest',
            foreignKey: 'ecoReqID'
        });
        ECORequestTypeValues.belongsTo(models.ECOTypeValues, {
            as: 'ecoTypeValues',
            foreignKey: 'ecoTypeValID'
        });
    };

    return ECORequestTypeValues;
};