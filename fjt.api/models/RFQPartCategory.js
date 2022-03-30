/* eslint-disable global-require */
module.exports = (sequelize) => {
    const Sequelize = require('sequelize');
    const RFQPartCategory = sequelize.define('RFQPartCategory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        categoryName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        colorCode: {
            type: Sequelize.STRING,
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
        epicorType: {
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
            tableName: 'rfq_partcategory',
            paranoid: true
        }
    );

    RFQPartCategory.associate = (models) => {
        RFQPartCategory.hasMany(models.Component, {
            foreignKey: 'partType',
            as: 'rfq_partcategory'
        });
    };


    return RFQPartCategory;
};
