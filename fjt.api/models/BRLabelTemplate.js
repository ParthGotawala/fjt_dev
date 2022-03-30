const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const BRLabelTemplate = sequelize.define('BRLabelTemplate', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        prefixlength: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        suffixlength: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        tempregexp: {
            type: Sequelize.STRING,
            allowNull: true
        },
        wildcardformat: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        mfgcodeid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Samplereaddata: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        separator: {
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
        barcodeType: {
            type: Sequelize.INTEGER,
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
        barcodeCategory: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            tableName: 'br_label_template',
            paranoid: true
        });

    BRLabelTemplate.associate = (models) => {
        BRLabelTemplate.hasMany(models.BRLabelTemplateDelimiter, {
            as: 'barcodeDelimiter',
            foreignKey: 'refbrID'
        });
        BRLabelTemplate.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodeDetail',
            foreignKey: 'mfgcodeid'
        });
    };


    return BRLabelTemplate;
};