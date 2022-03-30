const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const HelpBlogKeyword = sequelize.define('HelpBlogKeyword', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        keyword: {
            type: Sequelize.STRING,
            allowNull: true
        },
        helpBlogId: {
            type: Sequelize.INTEGER,
            allowNull: false
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
            tableName: 'help_blog_keyword'

        });

    HelpBlogKeyword.associate = (models) => {
        HelpBlogKeyword.belongsTo(models.HelpBlog, {
            as: 'helpBlog',
            foreignKey: 'helpBlogId'
        });
    };

    return HelpBlogKeyword;
};