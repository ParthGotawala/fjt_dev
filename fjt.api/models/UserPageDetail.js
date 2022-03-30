const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UserPageDetail = sequelize.define('UserPageDetail', {
        userPageID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        PageID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        RO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        RW: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
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
        isShortcut: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        IsShowInHomePage: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        roleID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        displayOrder: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 2)
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
        },
        isHelpBlog: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
    }, {
        paranoid: true,
        tableName: 'userpagedetail'
    });

    UserPageDetail.associate = (models) => {
        UserPageDetail.belongsTo(models.PageDetail, {
            as: 'PageDetails',
            foreignKey: 'PageID'
        });
        UserPageDetail.belongsTo(models.Role, {
            as: 'UserPageDetailRoles',
            foreignKey: 'roleID'
        });
    };
    return UserPageDetail;
};
