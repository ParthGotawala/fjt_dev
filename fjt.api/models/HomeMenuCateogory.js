const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const HomeMenuCateogory = sequelize.define('HomeMenuCateogory', {
        Id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userPageID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        roleID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        genericCategoryID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        displayOrder: {
            allowNull: false,
            type: Sequelize.DECIMAL(6, 2)
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
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isDeleted: {
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
            tableName: 'home_menu_cateogory',
            paranoid: true
        });
    return HomeMenuCateogory;
};