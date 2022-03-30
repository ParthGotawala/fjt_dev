const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentBOMSetting = sequelize.define('ComponentBOMSetting', {
        refComponentID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: false,
            primaryKey: true
        },
        bomLock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        liveInternalVersion: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        liveVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        exteranalAPICallStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isBOMVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActivityStart: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        activityStartBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        activityStartAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        activityStopAt: {
            type: Sequelize.DATE,
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
            tableName: 'component_bomsetting'
        });

    ComponentBOMSetting.associate = (models) => {
        ComponentBOMSetting.belongsTo(models.Component, {
            foreignKey: 'refComponentID',
            as: 'componentBOMSettings'
        });
        ComponentBOMSetting.belongsTo(models.User, {
            foreignKey: 'activityStartBy',
            as: 'user'
        });
    };
    return ComponentBOMSetting;
};