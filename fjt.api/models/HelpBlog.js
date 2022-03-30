const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const HelpBlog = sequelize.define('HelpBlog', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        pageID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        title: {
            allowNull: false,
            type: Sequelize.STRING
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
            tableName: 'help_blog'
        });

    HelpBlog.associate = (models) => {
        HelpBlog.belongsTo(models.PageDetail, {
            as: 'pageDetail',
            foreignKey: 'pageID'
        });
        HelpBlog.hasMany(models.HelpBlogKeyword, {
            foreignKey: 'helpBlogId',
            as: 'helpBlogKeyword'
        });
        HelpBlog.hasMany(models.HelpBlogDetail, {
            foreignKey: 'helpBlogId',
            as: 'helpBlogDetail'
        });
    };

    return HelpBlog;
};
