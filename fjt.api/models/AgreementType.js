const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const AgreementType = sequelize.define('AgreementType', {
        agreementTypeID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        agreementType: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        displayName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: null
        },
        purpose: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        where_used: {
            allowNull: true,
            type: Sequelize.TEXT
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
            tableName: 'agreement_type',
            paranoid: true
        });

    AgreementType.associate = (models) => {
        AgreementType.hasMany(models.Agreement, {
            foreignKey: 'agreementTypeID',
            as: 'agreements'
        });
    };

    return AgreementType;
};
