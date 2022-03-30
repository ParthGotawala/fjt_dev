const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InspectionTemplateMst = sequelize.define('InspectionTemplateMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
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
        }
    },
        {
            tableName: 'inspection_template_mst',
            paranoid: true
        }
    );

    InspectionTemplateMst.associate = (models) => {
        InspectionTemplateMst.hasMany(models.InspectionTemplateRequirementDet, {
            foreignKey: 'inspectionTemplateId',
            as: 'inspectionTemplateRequirementMst'
        });
    };

    return InspectionTemplateMst;
};
