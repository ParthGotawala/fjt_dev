const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const LabelTemplatesMst = sequelize.define('LabelTemplatesMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        // for Allow blank space for sparator conmment code notempty
        Name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                // notEmpty: false,
                len: [1, 255]
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        defaultLabelTemplate: {
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
        verifiedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        verifiedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        verifiedByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'labeltemplatesmst'
    });

    return LabelTemplatesMst;
};