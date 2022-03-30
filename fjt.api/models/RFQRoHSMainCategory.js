/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQRoHSMainCategory = sequelize.define('RFQRoHSMainCategory', {
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
        }
    },
        {
            tableName: 'rfq_rohs_main_categorymst',
            paranoid: true
        }
    );

    RFQRoHSMainCategory.associate = (models) => {
        RFQRoHSMainCategory.hasMany(models.RFQRoHS, {
            foreignKey: 'refMainCategoryID',
            as: 'rohs'
        });
    };

    return RFQRoHSMainCategory;
};
