const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RolePageDetail = sequelize.define('RolePageDetail', {
        rolePageID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        roleID: {
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
        isHelpBlog: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'rolepagedetail'
    });

    RolePageDetail.associate = (models) => {
        RolePageDetail.belongsTo(models.PageDetail, {
            foreignKey: 'PageID',
            as: 'pageDetail'
        });
    };

    return RolePageDetail;
};
