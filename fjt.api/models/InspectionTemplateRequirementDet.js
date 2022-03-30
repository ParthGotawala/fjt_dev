const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InspectionTemplateRequirementDet = sequelize.define('InspectionTemplateRequirementDet', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        inspectionRequirementId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        inspectionTemplateId: {
            type: Sequelize.INTEGER,
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }

    },
        {
            tableName: 'inspection_template_requirement_Det',
            paranoid: true
        });

    InspectionTemplateRequirementDet.associate = (models) => {
        InspectionTemplateRequirementDet.belongsTo(models.InspectionTemplateMst, {
            foreignKey: 'inspectionTemplateId',
            as: 'inspectionTemplateRequirementMst'
        });
        InspectionTemplateRequirementDet.belongsTo(models.InspectionMst, {
            as: 'inspectionmst',
            foreignKey: 'inspectionRequirementId'
        });
    };


    return InspectionTemplateRequirementDet;
};
