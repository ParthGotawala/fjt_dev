
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const BRLabelTemplateManualField = sequelize.define('BRLabelTemplateManualField', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        tableName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        tableField: {
            type: Sequelize.STRING,
            allowNull: true
        },
        displayName: {
            type: Sequelize.STRING,
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
        fieldDataType: {
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
            tableName: 'br_label_template_manualField',
            paranoid: true
        });

    return BRLabelTemplateManualField;
};