const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentNicknameWOBuildDetail = sequelize.define('ComponentNicknameWOBuildDetail', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nickName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastWOSeriesNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastWOBuildNumber: {
            type: Sequelize.STRING,
            allowNull: false
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
    }, {
        paranoid: true,
            tableName: 'component_nickname_wo_build_detail'
    });
    return ComponentNicknameWOBuildDetail;
};