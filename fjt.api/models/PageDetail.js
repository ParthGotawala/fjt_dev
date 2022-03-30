const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PageDetail = sequelize.define('PageDetail', {
        pageID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        pageName: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        RO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        RW: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        pageRoute: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pageURL: {
            type: Sequelize.STRING,
            allowNull: true
        },
        menuRoute: {
            type: Sequelize.STRING,
            allowNull: true
        },
        menuName: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        parentPageRoute: {
            type: Sequelize.STRING,
            allowNull: true
        },
        parentPageID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        hasChild: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        orderBy: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        tabLevel: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        parentTabID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        iconClass: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDisplay: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isHideFromMenuList: {
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
        },
        displayMenuName: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        isAllowAsHomePage: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        paramDet: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isReadOnlyDeveloped: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
    }, {
        paranoid: true,
        tableName: 'page_detail'
    });

    PageDetail.associate = (models) => {
        PageDetail.belongsTo(models.PageDetail, {
            foreignKey: 'parentPageID',
            as: 'parentPages'
        });
        PageDetail.hasMany(models.UserPageDetail, {
            foreignKey: 'PageID',
            as: 'userPageDetail'
        });
        PageDetail.hasMany(models.FeaturePageDetails, {
            foreignKey: 'PageID',
            as: 'featurePageDetail'
        });
        PageDetail.hasMany(models.HelpBlog, {
            foreignKey: 'PageID',
            as: 'helpBlog'
        });
        PageDetail.hasMany(models.PageDetailsKeywords, {
            foreignKey: 'pageID',
            as: 'pageDetailsKeywords'
        });
    };

    return PageDetail;
};
