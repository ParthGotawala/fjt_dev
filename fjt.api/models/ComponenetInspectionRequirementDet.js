const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponenetInspectionRequirementDet = sequelize.define('ComponenetInspectionRequirementDet', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partId: {
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
            allowNUll: true
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
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'componenet_inspection_requirement_det',
        paranoid: true
    });

    ComponenetInspectionRequirementDet.associate = (models) => {
        ComponenetInspectionRequirementDet.belongsTo(models.Component, {
            as: 'partmst',
            foreignKey: 'partId'
        });
        ComponenetInspectionRequirementDet.belongsTo(models.InspectionMst, {
            as: 'inspectionmst',
            foreignKey: 'inspectionRequirementId'
        });
    };

    return ComponenetInspectionRequirementDet;
};