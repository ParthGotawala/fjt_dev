const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DateCodeFormatMst = sequelize.define('DateCodeFormatMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        systemID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        dateCodeFormat: {
            allowNull: false,
            type: Sequelize.STRING
        },
        category: {
            allowNull: false,
            type: Sequelize.STRING
        },
        description: {
            allowNull: true,
            type: Sequelize.STRING
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
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
            tableName: 'date_code_format',
            paranoid: true
        });

    DateCodeFormatMst.associate = (models) => {
        DateCodeFormatMst.hasMany(models.MfgCodeMst, {
            foreignKey: 'id',
            as: 'dateCodeFormatID'
        });
    };

    return DateCodeFormatMst;
};
