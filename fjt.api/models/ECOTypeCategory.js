const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ECOTypeCategory = sequelize.define('ECOTypeCategory', {
        ecoTypeCatID: {
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
                len: [1, 1000]
            }
        },
        category: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        multiSelect: {
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
            paranoid: true,
            tableName: 'eco_type_category'
        });

    ECOTypeCategory.associate = (models) => {
        ECOTypeCategory.hasMany(models.ECOTypeValues, {
            as: 'ecoTypeValues',
            foreignKey: 'ecoTypeCatID'
        });
        ECOTypeCategory.hasMany(models.ECORequestTypeValues, {
            as: 'ecoRequestTypeValues',
            foreignKey: 'ecoTypeCatID'
        });
        ECOTypeCategory.hasMany(models.RFQAssyQuoteSubmittedTermsAndConditions, {
            as: 'rfqAssyTermsAndConditionCategorys',
            foreignKey: 'termsconditionCatID'
        });
    };

    return ECOTypeCategory;
};