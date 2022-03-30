const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const HelpBlogDetail = sequelize.define('HelpBlogDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        helpBlogId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        description: {
            allowNull: true,
            type: Sequelize.TEXT,
        },
        title: {
            allowNull: false,
            type: Sequelize.TEXT
        },
        displayOrder: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 2)
        },
        isSystemGenerated: {
            allowNull: true,
            type: Sequelize.BOOLEAN
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
            tableName: 'help_blog_det'
        });

    HelpBlogDetail.associate = (models) => {
        HelpBlogDetail.belongsTo(models.HelpBlog, {
            foreignKey: 'helpBlogId',
            as: 'helpBlog'
        });
    };

    return HelpBlogDetail;
};
