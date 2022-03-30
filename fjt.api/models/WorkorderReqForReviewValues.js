const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderReqForReviewValues = sequelize.define('WorkorderReqForReviewValues', {
        woRevReqValID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woRevReqID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        currentValue: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING(255),
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
            tableName: 'workorder_reqforreview_values',
            paranoid: true
        });

    WorkorderReqForReviewValues.associate = (models) => {
        WorkorderReqForReviewValues.belongsTo(models.WorkorderReqForReview, {
            as: 'workorder_reqforreview',
            foreignKey: 'woRevReqID'
        });
    };


    return WorkorderReqForReviewValues;
};
