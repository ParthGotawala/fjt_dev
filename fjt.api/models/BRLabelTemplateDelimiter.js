const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const BRLabelTemplateDelimiter = sequelize.define('BRLabelTemplateDelimiter', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refbrID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        delimiter: {
            type: Sequelize.STRING,
            allowNull: true
        },
        length: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dataElementId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        notes: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dataTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fieldType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
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
    },
        {
            tableName: 'br_label_template_delimiter',
            paranoid: true
        });

    BRLabelTemplateDelimiter.associate = (models) => {
        BRLabelTemplateDelimiter.belongsTo(models.BRLabelTemplate, {
            as: 'barcodeDelimiter',
            foreignKey: 'refbrID'
        });
        BRLabelTemplateDelimiter.belongsTo(models.DataElement, {
            as: 'dataelement',
            foreignKey: 'dataElementId'
        });
    };

    return BRLabelTemplateDelimiter;
};