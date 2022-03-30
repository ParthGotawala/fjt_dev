const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PageDetailsKeywords = sequelize.define('PageDetailsKeywords', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        keywords: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pageID: {
            type: Sequelize.INTEGER,
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
        tableName: 'page_details_keywords'
    });

    PageDetailsKeywords.associate = () => {
        // PageDetailsKeywords.hasMany(models.PageDetail, {
        //    foreignKey: 'pageID',
        //    as: 'PageDetail',
        // });
    };
    return PageDetailsKeywords;
};
