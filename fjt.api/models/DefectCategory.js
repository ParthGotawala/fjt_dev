/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DefectCategory = sequelize.define('DefectCategory', {
        defectCatId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        defectcatName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        colorCode: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 10]
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
        order: {
            type: Sequelize.DECIMAL(6, 2),
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
            tableName: 'defectCategory',
            paranoid: true
        });


    DefectCategory.associate = (models) => {
        DefectCategory.hasMany(models.WorkorderAssyDesignators, {
            foreignKey: 'defectCatId',
            as: 'workorder_assy_designators'
        });
    };

    return DefectCategory;
};
