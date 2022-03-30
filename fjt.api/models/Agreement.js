const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Agreement = sequelize.define('Agreement', {
        agreementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        agreementTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        agreementContent: {
            type: Sequelize.STRING,
            allowNull: false
        },
        version: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        system_variables: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isPublished: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        publishedDate: {
            allowNull: true,
            defaultValue: null,
            type: Sequelize.DATE
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
        agreementSubject: {
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
        }
    },
        {
            tableName: 'agreement',
            paranoid: true
        });

    Agreement.associate = (models) => {
        Agreement.belongsTo(models.AgreementType, {
            foreignKey: 'agreementTypeID',
            as: 'agreementType'
        });
    };

    return Agreement;
};
