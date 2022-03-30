const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const MfgCodeMstCommentDet = sequelize.define('MfgCodeMstCommentDet', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        mfgCodeId: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        inspectionRequirementId: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNUll: false,
            defaultValue: false
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        }
    }, {
        tableName: 'mfgcodemst_comment_det',
        paranoid: true
    });

    MfgCodeMstCommentDet.associate = (models) => {
    MfgCodeMstCommentDet.belongsTo(models.InspectionMst, {
        as: 'inspectionMst',
        foreignKey: 'inspectionRequirementId'
    });
    }
    return MfgCodeMstCommentDet;
};

