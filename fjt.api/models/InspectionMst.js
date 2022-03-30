const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InspectionMst = sequelize.define('InspectionMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        requirement: {
            type: Sequelize.STRING,
            allowNull: false
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
        },
        requiementType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        partRequirementCategoryID: {
            allowNull: true,
            type: Sequelize.INTEGER
        }
    },
        {
            tableName: 'inspection_mst',
            paranoid: true
        }
    );

    InspectionMst.associate = (models) => {
        InspectionMst.belongsTo(models.GenericCategory, {
            as: 'partRequirementCategory',
            foreignKey: 'partRequirementCategoryID'
        });
        InspectionMst.hasMany(models.MfgCodeMstCommentDet, {
            as: 'inspectionMst',
            foreignKey: 'inspectionRequirementId'
        });        
    };

    return InspectionMst;
};
