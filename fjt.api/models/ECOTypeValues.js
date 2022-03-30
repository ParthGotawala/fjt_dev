const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ECOTypeValues = sequelize.define('ECOTypeValues', {
        ecoTypeValID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ecoTypeCatID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 1000]
            }
        },
        noteRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
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
    },
        {
            paranoid: true,
            tableName: 'eco_type_values'
        });

    ECOTypeValues.associate = (models) => {
        ECOTypeValues.belongsTo(models.ECOTypeCategory, {
            as: 'ecoTypeCategory',
            foreignKey: 'ecoTypeCatID'
        });
        ECOTypeValues.hasMany(models.ECORequestTypeValues, {
            as: 'ecoRequestTypeValues',
            foreignKey: 'ecoTypeValID'
        });
        ECOTypeValues.hasMany(models.RFQAssyQuoteSubmittedTermsAndConditions, {
            as: 'rfqAssyTermsAndConditionTypeValues',
            foreignKey: 'termsconditionTypeValueID'
        });
    };

    return ECOTypeValues;
};