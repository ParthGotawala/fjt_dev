const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentStandardDetails = sequelize.define('ComponentStandardDetails', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        componentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        certificateStandardID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ClassID: {
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'component_standard_details'
        });

    ComponentStandardDetails.associate = (models) => {
        ComponentStandardDetails.belongsTo(models.Component, {
            as: 'Component',
            foreignKey: 'componentID'
        });
        ComponentStandardDetails.belongsTo(models.CertificateStandards, {
            as: 'certificateStandard',
            foreignKey: 'certificateStandardID'
        });
        ComponentStandardDetails.belongsTo(models.StandardClass, {
            as: 'Standardclass',
            foreignKey: 'ClassID'
        });
    };
    return ComponentStandardDetails;
};